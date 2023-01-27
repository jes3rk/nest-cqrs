import { ClassConstructor } from "class-transformer";
import { PREPROCESS_MIDDLEWARE_METADATA } from "../cqrs.constants";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

export const PreProcessMiddleware = (
  ...events: ClassConstructor<IMessage>[]
) => {
  return (target: ClassConstructor<IPrePublishMiddleware>) => {
    Reflect.defineMetadata(
      PREPROCESS_MIDDLEWARE_METADATA,
      events.map((e) => e.name),
      target,
    );
  };
};
