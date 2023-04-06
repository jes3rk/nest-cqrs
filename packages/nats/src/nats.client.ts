import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { connect, JetStreamClient, NatsConnection } from "nats";
import { NATS_CONFIG } from "./constants";
import { NatsConfig } from "./interfaces/nats.config";

@Injectable()
export class NatsClient implements OnModuleInit, OnApplicationShutdown {
  private _connection: NatsConnection;
  private _jetstreamClient: JetStreamClient;

  constructor(@Inject(NATS_CONFIG) private readonly config: NatsConfig) {}

  public async onModuleInit() {
    this._connection = await connect(this.config.connection);
    this._jetstreamClient = this._connection.jetstream();
  }

  public async onApplicationShutdown() {
    await this._connection.close();
  }
}
