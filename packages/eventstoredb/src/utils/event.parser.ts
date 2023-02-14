import { jsonEvent, JSONEventType } from "@eventstore/db-client";
import { instanceToPlain } from "class-transformer";
import {
  IEvent,
  IEventMetadata,
  upcastAndTransformEvent,
} from "@nest-cqrs/core";
import { JSONEvent } from "../types/json-event-type";
import { ctPlainToInstance } from "class-transformer-storage";

/**
 * Helper class for parsing events into and out of eventstoredb. The
 * database requires a certain format that doesn't map 1:1 with the
 * in-built message types.
 */
export class EventParser {
  /**
   * Take an event and format it according to the eventstoredb spec
   */
  public parseToJsonEvent(message: IEvent): JSONEvent {
    const { $metadata, $name, $uuid, ...rest } =
      instanceToPlain<IEvent>(message);
    return jsonEvent<JSONEventType<IEvent["$name"], Record<string, unknown>>>({
      data: rest,
      id: $uuid,
      metadata: $metadata,
      type: $name,
    });
  }

  /**
   * Take an event formatted to work with eventstoredb and reconstitute the object
   * to the current event types.
   *
   * TODO: Versioning
   */
  public readFromJsonEvent(event: JSONEvent): IEvent {
    const { data, id, metadata, type } = event;
    const plain: Partial<IEvent> = {
      $metadata: metadata as unknown as IEventMetadata,
      $name: type,
      $uuid: id,
      ...data,
    };
    return upcastAndTransformEvent(plain as IEvent);
  }
}
