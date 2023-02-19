import {
  IEvent,
  initializeAndAddToArrayMap,
  IPublisher,
} from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { EventParser } from "./utils/event.parser";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventStorePublisher implements IPublisher {
  constructor(private readonly client: EventStoreClient) {}

  public async publish(messages: IEvent[]): Promise<void> {
    const messagesMap = new Map<IEvent["$streamId"], IEvent[]>();
    messages.forEach((message) =>
      initializeAndAddToArrayMap(messagesMap, message.$streamId, message),
    );
    const parser = new EventParser();
    for await (const [streamId, events] of messagesMap.entries()) {
      await this.client.client.appendToStream(
        streamId,
        events.map((e) => parser.parseToJsonEvent(e)),
      );
    }
  }
}
