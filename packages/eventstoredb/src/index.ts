import {
  PluginConfiguration,
  CQRSProvider,
  EVENT_PUBLISHER,
  EVENT_READER,
} from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { EventStorePublisher } from "./eventstore.publisher";
import { EVENT_STORE_CONFIG } from "./eventstore.constants";
import { EventstoreDBConfig } from "./interfaces/eventstore.config";
import {
  ClassProvider,
  FactoryProvider,
  Provider,
  ValueProvider,
} from "@nestjs/common";
import { EventstoreReader } from "./eventstore.reader";

export function configureEventStoreDB(config: {
  eventStoreConfig: CQRSProvider<EventstoreDBConfig>;
}): PluginConfiguration {
  return {
    providers: [
      EventStoreClient,
      {
        provide: EVENT_PUBLISHER,
        useClass: EventStorePublisher,
      },
      {
        provide: EVENT_READER,
        useClass: EventstoreReader,
      },
      {
        provide: EVENT_STORE_CONFIG,
        ...config.eventStoreConfig,
      } as Provider,
    ],
    exports: [],
  };
}
