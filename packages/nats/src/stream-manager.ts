import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { NatsClient } from "./nats.client";

@Injectable()
export class StreamManager implements OnApplicationBootstrap {
  private streamNames: Set<string>;
  constructor(private readonly natsClient: NatsClient) {
    this.streamNames = new Set();
  }

  private streamIdToName(streamId: string): string {
    return streamId.split(".").slice(0, 3).join("$");
  }

  public async upsertStream(streamId: string): Promise<void> {
    const name = this.streamIdToName(streamId);
    if (this.streamNames.has(name)) return;
    await this.natsClient.manager.streams.add({
      name,
      subjects: [`${streamId}.>`],
    });
    this.streamNames.add(name);
  }

  public async onApplicationBootstrap() {
    const streams = await this.natsClient.manager.streams.list().next();
    streams.forEach((stream) => {
      this.streamNames.add(stream.config.name);
    });
  }
}
