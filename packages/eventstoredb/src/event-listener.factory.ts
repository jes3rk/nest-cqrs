import { Inject, Injectable } from "@nestjs/common";
import {
  APPLICATION_NAME,
  EventListenerFactory,
  IngestControllerEngine,
} from "@nest-cqrs/core";
import { EventStoreListener } from "./eventstore.listener";
import { EventStoreClient } from "./eventstore.client";

@Injectable()
export class EventStoreListenerFactory implements EventListenerFactory {
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
    private readonly client: EventStoreClient,
    private readonly engine: IngestControllerEngine,
  ) {}

  provideForNamespace(namespace: string): object {
    return new EventStoreListener(
      this.applicationName,
      this.client,
      this.engine,
      namespace,
    );
  }
}
