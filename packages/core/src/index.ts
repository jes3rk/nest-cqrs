import { ClassProvider, FactoryProvider, ValueProvider } from "@nestjs/common";

export { Aggregate } from "./decorators/aggregate.decorator";
export { AggregateFactory } from "./factories/aggregate.factory";
export { Apply } from "./decorators/apply.decorator";
export { Event } from "./classes/_base.event";
export { EventClient } from "./classes/event.client";
export { EventFactory } from "./factories/event.factory";
export { CQRSModule } from "./cqrs.module";
export { EVENT_PUBLISHER } from "./cqrs.constants";

export type { IEvent } from "./interfaces/event.interface";
export type { IPublisher } from "./interfaces/publisher.interface";
export type { IEventReader } from "./interfaces/event-reader.interface";
export type { PluginConfiguration } from "./interfaces/plugin-config.interface";
type _OmitProvider<T> = Omit<T, "provide">;
export type CQRSProvider<T> =
  | _OmitProvider<ClassProvider<T>>
  | _OmitProvider<FactoryProvider<T>>
  | _OmitProvider<ValueProvider<T>>;
