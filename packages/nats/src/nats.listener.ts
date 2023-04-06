import {
  BeforeApplicationShutdown,
  OnApplicationBootstrap,
} from "@nestjs/common";
import {
  IngestControllerEngine,
  MessageRequest,
  MessageType,
} from "@nest-cqrs/core";
import { consumerOpts, JetStreamSubscription, JsMsg, JSONCodec } from "nats";
import { NatsClient } from "./nats.client";
import { ctPlainToInstance } from "class-transformer-storage";

export class NatsListener
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private subscription: JetStreamSubscription;

  constructor(
    private readonly applicationName: string,
    private readonly client: NatsClient,
    private readonly ingestEngine: IngestControllerEngine,
    private readonly namespace: string,
  ) {}

  private async handleMessage(message: JsMsg): Promise<void> {
    try {
      message.working();
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
      message.ack();
    } catch (error) {
      message.nak(1000);
    }
  }

  public async onApplicationBootstrap() {
    const consumerOptions = consumerOpts();
    consumerOptions.durable(this.namespace);
    consumerOptions.deliverTo(this.namespace);
    consumerOptions.callback((err, msg) => {
      if (err) {
        return;
      }
      if (msg) {
        return this.handleMessage(msg);
      }
    });
    consumerOptions.queue(this.namespace);
    consumerOptions.manualAck();
    this.subscription = await this.client.jetstreamClient.subscribe(
      `${this.applicationName}.>`,
      consumerOptions,
    );
  }

  public beforeApplicationShutdown() {
    // this.subscription.unsubscribe();
  }
}
