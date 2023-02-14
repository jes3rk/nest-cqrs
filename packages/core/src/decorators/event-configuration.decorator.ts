import { applyDecorators, SetMetadata } from "@nestjs/common";
import { RegisterType } from "class-transformer-storage";
import { EVENT_CONFIGURATION } from "../cqrs.constants";
import { IEventConfiguration } from "../interfaces/event-configuration.interface";

/**
 * Decorator for an event to apply metadata for processing the event and
 * will register with ClassTransformerStorage for convience.
 */
export const EventConfiguration = (params: IEventConfiguration) =>
  applyDecorators(RegisterType(), SetMetadata(EVENT_CONFIGURATION, params));
