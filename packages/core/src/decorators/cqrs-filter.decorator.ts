import { ExceptionFilter } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { EXCEPTION_FILTER_METADATA } from "../cqrs.constants";

export const CQRSFilter = (...exceptions: ClassConstructor<Error>[]) => {
  return (
    target: ClassConstructor<ExceptionFilter<typeof exceptions[number]>>,
  ) => {
    Reflect.defineMetadata(
      EXCEPTION_FILTER_METADATA,
      exceptions.map((e) => e.name),
      target,
    );
  };
};
