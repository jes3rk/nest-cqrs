import { ClassConstructor } from "class-transformer";
import { PREPUBLISH_MIDDLEWARE_METADATA } from "../cqrs.constants";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

/**
 * Mark a provider as pre-publish middleware to be called
 * prior to publishing an event to the event store.
 */
export const PrePublishMiddleware = (
  ...events: ClassConstructor<IMessage>[]
) => {
  return (target: ClassConstructor<IPrePublishMiddleware>) => {
    Reflect.defineMetadata(
      PREPUBLISH_MIDDLEWARE_METADATA,
      events.map((e) => e.name),
      target,
    );
  };
};
