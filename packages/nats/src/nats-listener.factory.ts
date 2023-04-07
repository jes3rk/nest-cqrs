import { Inject, Injectable } from "@nestjs/common";
import {
  APPLICATION_NAME,
  EventListenerFactory,
  IngestControllerEngine,
} from "@nest-cqrs/core";
import { NatsClient } from "./nats.client";
import { NatsListener } from "./nats.listener";

@Injectable()
export class NatsListenerFactory implements EventListenerFactory {
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
    private readonly client: NatsClient,
    private readonly engine: IngestControllerEngine,
  ) {}

  provideForNamespace(namespace: string): object {
    return new NatsListener(
      this.applicationName,
      this.client,
      this.engine,
      namespace,
    );
  }
}
