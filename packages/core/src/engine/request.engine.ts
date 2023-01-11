import {
  ExceptionFilter,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { MessageRequest } from "../classes/message-request.class";
import {
  EXCEPTION_FILTER_METADATA,
  MessageRequestState,
  PREPROCESS_MIDDLEWARE_METADATA,
  PREPUBLISH_MIDDLEWARE_METADATA,
} from "../cqrs.constants";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { DiscoveryService } from "@nestjs/core";
import { MessagePublisher } from "../publishers/message.publisher";
import { IEvent } from "../interfaces/event.interface";
import { initializeAndAddToArrayMap } from "../cqrs.utilites";
import { IngestControllerEngine } from "./ingest-controller.engine";

@Injectable()
export class RequestEngine implements OnApplicationBootstrap {
  private globalPrePublishMiddleware: IPrePublishMiddleware[];
  private scopedPrePublishMiddleware: Map<
    IEvent["$name"],
    IPrePublishMiddleware[]
  >;
  private globalPreProcessMiddleware: IPreProcessMiddleware[];
  private scopedPreProcessMiddleware: Map<
    IEvent["$name"],
    IPreProcessMiddleware[]
  >;
  private filters: Map<string, ExceptionFilter[]>;

  constructor(
    private readonly explorer: DiscoveryService,
    private readonly publisher: MessagePublisher,
    private readonly ingestEngine: IngestControllerEngine,
  ) {
    this.globalPrePublishMiddleware = [];
    this.scopedPrePublishMiddleware = new Map();

    this.globalPreProcessMiddleware = [];
    this.scopedPreProcessMiddleware = new Map();
    this.filters = new Map();
  }

  private async _handleStateFilters(message: MessageRequest): Promise<void> {
    if (this.filters.has(message.error.name)) {
      for await (const filter of this.filters.get(message.error.name)) {
        await filter.catch(message.error, undefined);
      }
    }
  }

  private async _handleStateInitiated(message: MessageRequest): Promise<void> {
    try {
      message.setStatePrePublish();
      for await (const middleware of this.globalPrePublishMiddleware.concat(
        this.scopedPrePublishMiddleware.get(message.$name) || [],
      )) {
        await message.applyMiddleware(middleware);
      }
    } catch (err) {
      message.setStateErrored(err);
    }
    return this.handleMessageRequest(message);
  }

  private async _handleStatePublish(message: MessageRequest): Promise<void> {
    try {
      message.setStatePublish();
      await this.publisher.publish(message);
    } catch (err) {
      message.setStateErrored(err);
    }
    return this.handleMessageRequest(message);
  }

  private async _handleStateIngested(message: MessageRequest): Promise<void> {
    try {
      message.setStatePreProcess();
      for await (const middleware of this.globalPreProcessMiddleware.concat(
        this.scopedPreProcessMiddleware.get(message.$name) || [],
      )) {
        await message.applyMiddleware(middleware);
      }
    } catch (err) {
      message.setStateErrored(err);
    }
    return this.handleMessageRequest(message);
  }

  private async _handleStateProcess(message: MessageRequest): Promise<void> {
    try {
      message.setStateProcess();
      const msg = Object.freeze(message.message);
      for await (const handler of this.ingestEngine.getControllerEndpointsForMessageName(
        message.$name,
      )) {
        await handler(msg);
      }
    } catch (err) {
      message.setStateErrored(err);
    }
  }

  public handleMessageRequest(message: MessageRequest): Promise<void> {
    switch (message.STATE) {
      case MessageRequestState.INITIATED:
        return this._handleStateInitiated(message);
      case MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE:
        return this._handleStatePublish(message);
      case MessageRequestState.INGESTED:
        return this._handleStateIngested(message);
      case MessageRequestState.APPLY_PREPROCESS_MIDDLEWARE:
        return this._handleStateProcess(message);
      case MessageRequestState.APPLY_FILTERS:
        return this._handleStateFilters(message);
    }
  }

  public onApplicationBootstrap() {
    this.explorer.getProviders().forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance) return;
      if (
        Reflect.hasMetadata(
          PREPUBLISH_MIDDLEWARE_METADATA,
          instance.constructor,
        )
      ) {
        const eventNames: string[] = Reflect.getMetadata(
          PREPUBLISH_MIDDLEWARE_METADATA,
          instance.constructor,
        );
        if (eventNames.length > 0) {
          eventNames.forEach((name) =>
            initializeAndAddToArrayMap(
              this.scopedPrePublishMiddleware,
              name,
              instance,
            ),
          );
        } else {
          this.globalPrePublishMiddleware.push(instance);
        }
      }

      if (
        Reflect.hasMetadata(
          PREPROCESS_MIDDLEWARE_METADATA,
          instance.constructor,
        )
      ) {
        const eventNames: string[] = Reflect.getMetadata(
          PREPROCESS_MIDDLEWARE_METADATA,
          instance.constructor,
        );
        if (eventNames.length > 0) {
          eventNames.forEach((name) =>
            initializeAndAddToArrayMap(
              this.scopedPreProcessMiddleware,
              name,
              instance,
            ),
          );
        } else {
          this.globalPreProcessMiddleware.push(instance);
        }
      }

      if (
        Reflect.hasMetadata(EXCEPTION_FILTER_METADATA, instance.constructor)
      ) {
        const exceptions = Reflect.getMetadata(
          EXCEPTION_FILTER_METADATA,
          instance.constructor,
        );
        exceptions.forEach((e) => {
          if (!this.filters.has(e)) this.filters.set(e, []);
          this.filters.get(e).push(instance);
        });
      }
    });
  }
}
