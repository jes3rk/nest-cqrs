import { IEvent } from "../interfaces/event.interface";
import { ClassConstructor } from "class-transformer";
import { APPLY_METADATA } from "../cqrs.constants";

/**
 * Mark a method as the handler for a given event type
 * @param event
 */
export const Apply = (event: ClassConstructor<IEvent>) => {
  return (target: object, key: string) => {
    if (!Reflect.hasMetadata(APPLY_METADATA, target)) {
      Reflect.defineMetadata(APPLY_METADATA, new Map(), target);
    }
    (Reflect.getMetadata(APPLY_METADATA, target) as Map<string, string>).set(
      event.name,
      key,
    );
  };
};
