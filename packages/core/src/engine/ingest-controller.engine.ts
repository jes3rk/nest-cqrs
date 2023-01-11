import {
  ExceptionFilter,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import {
  EXCEPTION_FILTER_METADATA,
  INGEST_ENDPOINT_METADATA,
  MessageRequestState,
  NAMESPACE,
  PREPROCESS_MIDDLEWARE_METADATA,
} from "../cqrs.constants";
import { IMessage } from "../interfaces/message.interface";
import { initializeAndAddToArrayMap } from "../cqrs.utilites";
import { MessageRequest } from "../classes/message-request.class";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { IEvent } from "../interfaces/event.interface";

type HandlerFn<T extends IMessage> = (message: T) => void | Promise<void>;

@Injectable()
export class IngestControllerEngine implements OnApplicationBootstrap {
  private ingestControllerMap: Map<
    string,
    Map<IMessage["$name"], HandlerFn<IMessage>[]>
  >;
  private globalPreProcessMiddleware: IPreProcessMiddleware[];
  private scopedPreProcessMiddleware: Map<
    IEvent["$name"],
    IPreProcessMiddleware[]
  >;
  private filters: Map<string, ExceptionFilter[]>;

  constructor(private readonly discovery: DiscoveryService) {
    this.ingestControllerMap = new Map();
    this.globalPreProcessMiddleware = [];
    this.scopedPreProcessMiddleware = new Map();
    this.filters = new Map();
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
    return this.handleIngestRequest(message);
  }

  private async _handleStateProcess(message: MessageRequest): Promise<void> {
    try {
      message.setStateProcess();
      const msg = Object.freeze(message.message);
      for await (const handler of this.ingestControllerMap
        .get(message.namespace)
        .get(message.$name)) {
        await handler(msg);
      }
    } catch (err) {
      message.setStateErrored(err);
    }
    return this.handleIngestRequest(message);
  }

  private async _handleStateFilters(message: MessageRequest): Promise<void> {
    if (this.filters.has(message.error.name)) {
      for await (const filter of this.filters.get(message.error.name)) {
        await filter.catch(message.error, undefined);
      }
    }
  }

  public handleIngestRequest(message: MessageRequest): Promise<void> {
    switch (message.STATE) {
      case MessageRequestState.INGESTED:
        return this._handleStateIngested(message);
      case MessageRequestState.APPLY_PREPROCESS_MIDDLEWARE:
        return this._handleStateProcess(message);
      case MessageRequestState.APPLY_FILTERS:
        return this._handleStateFilters(message);
    }
  }

  public onApplicationBootstrap() {
    this.discovery.getProviders().forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance) return;
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

    this.discovery.getControllers().forEach((wrapper) => {
      const { instance, host } = wrapper;
      if (!(instance && host)) return;

      const nsWrapper = host.getProviderByKey<string>(NAMESPACE);
      if (!nsWrapper) return; // if there is no namespace, exit
      const namespace = nsWrapper.instance;

      if (!this.ingestControllerMap.has(namespace))
        this.ingestControllerMap.set(namespace, new Map());

      Reflect.ownKeys(Object.getPrototypeOf(instance)).forEach((methodName) => {
        const eventNames: IMessage["$name"][] = Reflect.getMetadata(
          INGEST_ENDPOINT_METADATA,
          instance[methodName],
        );
        if (!eventNames) return;
        eventNames.forEach((name) => {
          initializeAndAddToArrayMap(
            this.ingestControllerMap.get(namespace),
            name,
            instance[methodName].bind(instance),
          );
        });
      });
    });
  }
}
