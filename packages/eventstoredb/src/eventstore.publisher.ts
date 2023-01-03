import { IEvent, IPublisher } from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { EventParser } from "./utils/event.parser";

export class EventStorePublisher implements IPublisher {
  constructor(private readonly client: EventStoreClient) {}

  public async publish(message: IEvent): Promise<void> {
    const event = new EventParser().parseToJsonEvent(message);
    await this.client.client.appendToStream(message.$streamID, event);
  }
}
