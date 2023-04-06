import { IEvent, IPublisher } from "@nest-cqrs/core";
import { Injectable } from "@nestjs/common";
import { JSONCodec } from "nats";
import { NatsClient } from "./nats.client";

@Injectable()
export class NatsPublisher implements IPublisher {
  constructor(private readonly client: NatsClient) {}

  public async publish(messages: IEvent[]): Promise<void> {
    const codec = JSONCodec();
    for (const message of messages) {
      await this.client.jetstreamClient.publish(
        message.$streamId,
        codec.encode(message),
        { msgID: message.$uuid },
      );
    }
  }
}
