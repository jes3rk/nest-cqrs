import { ExceptionFilter } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import {
  EXCEPTION_FILTER_METADATA,
  PREPUBLISH_MIDDLEWARE_METADATA,
} from "../cqrs.constants";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

export const CQRSFilter = (...exceptions: ClassConstructor<Error>[]) => {
  return (target: ClassConstructor<ExceptionFilter>) => {
    Reflect.defineMetadata(
      EXCEPTION_FILTER_METADATA,
      exceptions.map((e) => e.name),
      target,
    );
  };
};
