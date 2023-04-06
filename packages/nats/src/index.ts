import {
  PluginConfiguration,
  CQRSProvider,
  EVENT_PUBLISHER,
  EVENT_READER,
  TRANSIENT_LISTENER,
  EVENT_LISTENER_FACTORY,
} from "@nest-cqrs/core";
import { Logger, Provider } from "@nestjs/common";
import { NATS_CONFIG, NATS_LOGGER } from "./constants";
import { NatsConfig } from "./interfaces/nats.config";
import { NatsListenerFactory } from "./nats-listener.factory";
import { NatsClient } from "./nats.client";
import { NatsPublisher } from "./nats.publisher";
import { JetStreamReader } from "./nats.reader";
import { TransientSubscriptionFactory } from "./transient-subscription.factory";

export function configureNats(config: {
  eventStoreConfig: CQRSProvider<NatsConfig>;
}): PluginConfiguration {
  return {
    providers: [
      {
        provide: NATS_LOGGER,
        useFactory() {
          return new Logger("NATS");
        },
      },
      NatsClient,
      TransientSubscriptionFactory,
      {
        provide: EVENT_PUBLISHER,
        useClass: NatsPublisher,
      },
      {
        provide: EVENT_READER,
        useClass: JetStreamReader,
      },
      {
        provide: NATS_CONFIG,
        ...config.eventStoreConfig,
      } as Provider,
      {
        provide: EVENT_LISTENER_FACTORY,
        useClass: NatsListenerFactory,
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
