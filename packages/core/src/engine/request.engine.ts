import {
  ExceptionFilter,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { MessageRequest } from "../classes/message-request.class";
import {
  EXCEPTION_FILTER_METADATA,
  MessageRequestState,
  PREPUBLISH_MIDDLEWARE_METADATA,
} from "../cqrs.constants";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { DiscoveryService } from "@nestjs/core";
import { MessagePublisher } from "../publishers/message.publisher";
import { IEvent } from "../interfaces/event.interface";
import { initializeAndAddToArrayMap } from "../cqrs.utilites";

@Injectable()
export class RequestEngine implements OnApplicationBootstrap {
  private globalPrePublishMiddleware: IPrePublishMiddleware[];
  private scopedPrePublishMiddleware: Map<
    IEvent["$name"],
    IPrePublishMiddleware[]
  >;
  private preProcessMiddleware: IPreProcessMiddleware[];
  private filters: Map<string, ExceptionFilter[]>;

  constructor(
    private readonly explorer: DiscoveryService,
    private readonly publisher: MessagePublisher,
  ) {
    this.globalPrePublishMiddleware = [];
    this.scopedPrePublishMiddleware = new Map();

    this.preProcessMiddleware = [];
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

  public handleMessageRequest(message: MessageRequest): Promise<void> {
    switch (message.STATE) {
      case MessageRequestState.INITIATED:
        return this._handleStateInitiated(message);
      case MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE:
        return this._handleStatePublish(message);
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
