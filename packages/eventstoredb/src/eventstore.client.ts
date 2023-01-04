import { EventStoreDBClient } from "@eventstore/db-client";
import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { EVENT_STORE_CONFIG } from "./eventstore.constants";
import { EventstoreDBConfig } from "./interfaces/eventstore.config";

@Injectable()
export class EventStoreClient implements OnModuleInit, OnApplicationShutdown {
  private _client: EventStoreDBClient;

  constructor(
    @Inject(EVENT_STORE_CONFIG) private readonly _config: EventstoreDBConfig,
  ) {}

  public get client(): EventStoreDBClient {
    return this._client;
  }

  public onModuleInit() {
    this._client = this._config.connectionString
      ? EventStoreDBClient.connectionString(this._config.connectionString)
      : undefined;
  }

  public async onApplicationShutdown() {
    await this._client.dispose();
  }
}
