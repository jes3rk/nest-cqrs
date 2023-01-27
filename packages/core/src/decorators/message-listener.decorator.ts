import { SetMetadata } from "@nestjs/common";
import { INGEST_ENDPOINT_METADATA } from "../cqrs.constants";
import { IEvent } from "../interfaces/event.interface";
import { ClassConstructor } from "class-transformer";
import { IMessage } from "../interfaces/message.interface";

/**
 * Mark a controller endpoint to listen to any number of
 * event messages.
 *
 * @param events
 */
export const MessageListener = (...events: ClassConstructor<IMessage>[]) =>
  SetMetadata(
    INGEST_ENDPOINT_METADATA,
    events.map((e) => e.name),
  );
