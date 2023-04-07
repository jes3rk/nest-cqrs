import { OnApplicationBootstrap } from "@nestjs/common";
import {
  IngestControllerEngine,
  MessageRequest,
  MessageType,
} from "@nest-cqrs/core";
import { JSONCodec, Msg } from "nats";
import { NatsClient } from "./nats.client";
import { ctPlainToInstance } from "class-transformer-storage";

export class NatsListener implements OnApplicationBootstrap {
  constructor(
    private readonly applicationName: string,
    private readonly client: NatsClient,
    private readonly ingestEngine: IngestControllerEngine,
    private readonly namespace: string,
  ) {}

  private async handleMessage(message: Msg): Promise<void> {
    try {
      const decoded = JSONCodec().decode(message.data);
      const transformed = ctPlainToInstance(decoded, {
        getName(plain) {
          return plain["$name"];
        },
      });
      const messageRequest = MessageRequest.ingestMessage(
        transformed,
        MessageType.EVENT,
        this.namespace,
      );
      await this.ingestEngine.handleIngestRequest(messageRequest);
    } catch (error) {}
  }

  public onApplicationBootstrap() {
    this.client.client.subscribe(`${this.applicationName}.>`, {
      queue: this.namespace,
      callback: (err, msg) => {
        if (err) return;
        if (msg) {
          this.handleMessage(msg);
        }
      },
    });
  }
}
