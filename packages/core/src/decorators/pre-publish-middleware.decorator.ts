import { ClassConstructor } from "class-transformer";
import { PREPUBLISH_MIDDLEWARE_METADATA } from "../cqrs.constants";
import { IEvent } from "../interfaces/event.interface";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

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
