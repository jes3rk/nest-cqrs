import { ClassConstructor } from "class-transformer";
import { PREPUBLISH_MIDDLEWARE_METADATA } from "../cqrs.constants";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

export const PrePublishMiddleware = () => {
  return (target: ClassConstructor<IPrePublishMiddleware>) => {
    Reflect.defineMetadata(PREPUBLISH_MIDDLEWARE_METADATA, "", target);
  };
};
