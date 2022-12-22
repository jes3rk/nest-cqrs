import { EventStoreDBClient } from "@eventstore/db-client";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class EventStoreClient implements OnModuleInit {
  private _client: EventStoreDBClient;

  public get client(): EventStoreDBClient {
    return this._client;
  }

  public onModuleInit() {
    this._client = EventStoreDBClient.connectionString`esdb+discover://localhost:2113?keepAliveTimeout=10000&keepAliveInterval=10000`;
  }
}
