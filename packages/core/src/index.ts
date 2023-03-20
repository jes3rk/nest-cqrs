import { ClassProvider, FactoryProvider, ValueProvider } from "@nestjs/common";

export { Aggregate } from "./decorators/aggregate.decorator";
export { AggregateFactory } from "./factories/aggregate.factory";
export { AggregateRoot } from "./classes/aggregate.root";
export { Apply } from "./decorators/apply.decorator";
export { CQRSFilter } from "./decorators/cqrs-filter.decorator";
export { Event } from "./classes/_base.event";
export { EventBuilderFactory } from "./factories/event-builder.factory";
export { EventClient } from "./classes/event.client";
export { EventConfiguration } from "./decorators/event-configuration.decorator";
export { EventVersioner } from "./classes/_base.event-versioner";
export { IngestControllerEngine } from "./engine/ingest-controller.engine";
export { InjectSubscriberFactory } from "./decorators/inject-subscriber-factory.decorator";
export { MessageListener } from "./decorators/message-listener.decorator";
export { PreProcessMiddleware } from "./decorators/pre-process-middleware.decorator";
export { PrePublishMiddleware } from "./decorators/pre-publish-middleware.decorator";
export { MessageRequest } from "./classes/message-request.class";
export { SubscriberFactory } from "./factories/subscriber.factory";
export { CQRSModule } from "./cqrs.module";
export {
  APPLICATION_NAME,
  EVENT_CONFIGURATION,
  EVENT_LISTENER_FACTORY,
  EVENT_PUBLISHER,
  EVENT_READER,
  MessageType,
  REQUEST_CLIENT_HEADER,
} from "./cqrs.constants";
export {
  initializeAndAddToArrayMap,
  parseStreamID,
  upcastAndTransformEvent,
} from "./cqrs.utilites";

export type { IEvent, IEventMetadata } from "./interfaces/event.interface";
export type { IEventReader } from "./interfaces/event-reader.interface";
export type { IPreProcessMiddleware } from "./interfaces/preprocess-middleware.interface";
export type { IPrePublishMiddleware } from "./interfaces/prepublish-middleware.interface";
export type { IPublisher } from "./interfaces/publisher.interface";
export type { PluginConfiguration } from "./interfaces/plugin-config.interface";
export type { EventListenerFactory } from "./interfaces/event-listener-factory.interface";

type _OmitProvider<T> = Omit<T, "provide">;
export type CQRSProvider<T> =
  | _OmitProvider<ClassProvider<T>>
  | _OmitProvider<FactoryProvider<T>>
  | _OmitProvider<ValueProvider<T>>;
