import { IEvent, IPublisher } from "@nest-cqrs/core";
import { Injectable } from "@nestjs/common";
import { JSONCodec } from "nats";
import { NatsClient } from "./nats.client";
import { StreamManager } from "./stream-manager";

@Injectable()
export class NatsPublisher implements IPublisher {
  constructor(
    private readonly client: NatsClient,
    private readonly streamManager: StreamManager,
  ) {}

  public async publish(messages: IEvent[]): Promise<void> {
    const codec = JSONCodec();
    const streamIds = new Set(messages.map((m) => m.$streamId));
    for (const streamId of streamIds) {
      await this.streamManager.upsertStream(streamId);
    }
    for (const message of messages) {
      await this.client.jetstreamClient.publish(
        `${message.$streamId}.${message.$name.toLowerCase()}`,
        codec.encode(message),
        { msgID: message.$uuid },
      );
    }
  }
}
