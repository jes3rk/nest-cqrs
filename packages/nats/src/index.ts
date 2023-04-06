import {
  PluginConfiguration,
  CQRSProvider,
  EVENT_PUBLISHER,
  EVENT_READER,
  TRANSIENT_LISTENER,
  EVENT_LISTENER_FACTORY,
} from "@nest-cqrs/core";
import { Provider } from "@nestjs/common";
import { NATS_CONFIG } from "./constants";
import { NatsConfig } from "./interfaces/nats.config";
import { NatsClient } from "./nats.client";

export function configureNats(config: {
  eventStoreConfig: CQRSProvider<NatsConfig>;
}): PluginConfiguration {
  return {
    providers: [
      NatsClient,
      //TransientSubscriptionFactory,
      //{
      //provide: EVENT_PUBLISHER,
      //useClass: EventStorePublisher,
      //},
      //{
      //provide: EVENT_READER,
      //useClass: EventstoreReader,
      //},
      {
        provide: NATS_CONFIG,
        ...config.eventStoreConfig,
      } as Provider,
      // {
      //   provide: EVENT_LISTENER_FACTORY,
      //   useClass: EventStoreListenerFactory,
      // },
      // {
      //   provide: TRANSIENT_LISTENER,
      //   inject: [TransientSubscriptionFactory],
      //   useFactory(factory: TransientSubscriptionFactory) {
      //     return factory.createTransientSubscription();
      //   },
      // },
    ],
    exports: [],
  };
}
