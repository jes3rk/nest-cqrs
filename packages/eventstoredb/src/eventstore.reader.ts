import { Injectable } from "@nestjs/common";
import { IEvent, IEventReader } from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { EventParser } from "./utils/event.parser";
import { JSONEvent } from "./types/json-event-type";
import { START, StreamNotFoundError } from "@eventstore/db-client";

@Injectable()
export class EventstoreReader implements IEventReader {
  constructor(private readonly client: EventStoreClient) {}

  public async readStreamAsynchronously(
    streamId: string,
    callback: (event: IEvent) => void,
  ): Promise<void> {
    const parser = new EventParser();
    const stream = this.client.client.readStream(streamId, {
      direction: "forwards",
      fromRevision: START,
    });

    try {
      for await (const raw of stream) {
        if (!raw.event) throw Error();
        const event = parser.readFromJsonEvent(
          raw.event as unknown as JSONEvent,
        );
        event.$streamId = streamId;
        callback(event);
      }
    } catch (err) {
      if (err instanceof StreamNotFoundError) {
        return;
      }
      throw err;
    }
  }
}
