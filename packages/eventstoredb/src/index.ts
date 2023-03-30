import {
  PluginConfiguration,
  CQRSProvider,
  EVENT_PUBLISHER,
  EVENT_READER,
  TRANSIENT_LISTENER,
  EVENT_LISTENER_FACTORY,
} from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { EventStorePublisher } from "./eventstore.publisher";
import { EVENT_STORE_CONFIG } from "./eventstore.constants";
import { EventstoreDBConfig } from "./interfaces/eventstore.config";
import { Provider, Scope } from "@nestjs/common";
import { EventstoreReader } from "./eventstore.reader";
import { EventStoreListenerFactory } from "./event-listener.factory";
import { TransientSubscriptionFactory } from "./transient-listener.factory";

export function configureEventStoreDB(config: {
  eventStoreConfig: CQRSProvider<EventstoreDBConfig>;
}): PluginConfiguration {
  return {
    providers: [
      EventStoreClient,
      TransientSubscriptionFactory,
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
      {
        provide: EVENT_LISTENER_FACTORY,
        useClass: EventStoreListenerFactory,
      },
      {
        provide: TRANSIENT_LISTENER,
        inject: [TransientSubscriptionFactory],
        useFactory(factory: TransientSubscriptionFactory) {
          return factory.createTransientSubscription();
        },
      },
    ],
    exports: [],
  };
}
