import { Inject, Injectable, Logger } from "@nestjs/common";
import { IEvent, IEventReader } from "@nest-cqrs/core";
import { NatsClient } from "./nats.client";
import { consumerOpts, JSONCodec } from "nats";
import { ctPlainToInstance } from "class-transformer-storage";
import { NATS_LOGGER } from "./constants";

@Injectable()
export class JetStreamReader implements IEventReader {
  constructor(
    private readonly client: NatsClient,
    @Inject(NATS_LOGGER) private readonly logger: Logger,
  ) {}

  public async readStreamAsynchronously(
    streamId: string,
    callback: (event: IEvent) => void,
  ): Promise<void> {
    const codec = JSONCodec();
    const consumerOptions = consumerOpts();
    consumerOptions.ackExplicit();
    consumerOptions.startSequence(1);
    try {
      await this.client.manager.streams.find(`${streamId}.>`);
      const sub = await this.client.jetstreamClient.pullSubscribe(
        `${streamId}.>`,
        consumerOptions,
      );

      const consumer = await sub.consumerInfo();
      const batchSize = 10;
      sub.pull({ batch: batchSize, no_wait: true });
      let batchCount = 0;
      if (consumer.num_pending === 0) return sub.destroy();

      for await (const msg of sub) {
        const decoded = codec.decode(msg.data);
        const parsed = ctPlainToInstance(decoded, {
          getName(plain) {
            return plain["$name"];
          },
        });
        callback(parsed);
        const info = await sub.consumerInfo();
        msg.ack();
        batchCount++;
        if (info.num_pending !== 0 && batchCount === batchSize) {
          sub.pull({ batch: batchSize, no_wait: true });
          batchCount = 0;
        } else {
          break;
        }
      }
      await sub.destroy();
    } catch (err) {
      if (err.message !== "no stream matches subject") {
        throw err;
      }
    }
  }
}
