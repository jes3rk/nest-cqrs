import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import {
  connect,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
} from "nats";
import { NATS_CONFIG } from "./constants";
import { NatsConfig } from "./interfaces/nats.config";

@Injectable()
export class NatsClient implements OnModuleInit, OnApplicationShutdown {
  private _connection: NatsConnection;
  private _jetstreamClient: JetStreamClient;
  private _jetstreamManager: JetStreamManager;

  constructor(@Inject(NATS_CONFIG) private readonly config: NatsConfig) {}

  public get client(): NatsConnection {
    return this._connection;
  }

  public get jetstreamClient(): JetStreamClient {
    return this._jetstreamClient;
  }

  public get manager(): JetStreamManager {
    return this._jetstreamManager;
  }

  public async onModuleInit() {
    this._connection = await connect(this.config.connection);
    this._jetstreamClient = this._connection.jetstream();
    this._jetstreamManager = await this._connection.jetstreamManager();
  }

  public async onApplicationShutdown() {
    await this._connection.drain();
  }
}
