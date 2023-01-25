import { DynamicModule, Global, Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { EventClient } from "./classes/event.client";
import { RequestEngine } from "./engine/request.engine";
import { MessagePublisher } from "./publishers/message.publisher";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, DiscoveryModule } from "@nestjs/core";
import { EventBuilderFactory } from "./factories/event-builder.factory";
import { AggregateFactory } from "./factories/aggregate.factory";
import { CQRSModuleConfig } from "./interfaces/module.config";
import { ClsModule } from "nestjs-cls";
import { MetadataInterceptor } from "./classes/metadata.interceptor";
import { RequestMetadataMiddleware } from "./middleware/request-metadata.middleware";
import { IngestControllerEngine } from "./engine/ingest-controller.engine";
import { CQRSModuleForFeature } from "./interfaces/module-forFeature.config";
import {
  APPLICATION_NAME,
  EVENT_LISTENER_FACTORY,
  NAMESPACE,
} from "./cqrs.constants";
import { EventListenerFactory } from "./interfaces/event-listener-factory.interface";
import { SubscriberFactory } from "./factories/subscriber.factory";

@Module({})
class CQRSCoreModule {}

@Module({})
export class CQRSModule {
  /**
   * Provide feature level configs, including grouping related modules
   * by namespace to treat them as one consumer.
   */
  public static forFeature(config: CQRSModuleForFeature): DynamicModule {
    const subscriberToken = `SubscriberFactory::${config.namespace}`;
    return {
      module: CQRSModule,
      exports: [NAMESPACE, subscriberToken],
      providers: [
        {
          provide: NAMESPACE,
          useValue: config.namespace,
        },
        {
          provide: `EventListener::${config.namespace}`,
          inject: [EVENT_LISTENER_FACTORY, subscriberToken],
          useFactory(
            factory: EventListenerFactory,
            subFactory: SubscriberFactory,
          ) {
            return factory.provideForNamespace(config.namespace, subFactory);
          },
        },
        {
          provide: subscriberToken,
          useClass: SubscriberFactory,
        },
      ],
    };
  }

  /**
   * Configure the module at the root level. Will automatically import
   * the config module and other required modules.
   */
  public static forRoot(config: CQRSModuleConfig): DynamicModule {
    const { applicationName, includeCLS = true, eventStoreConfig } = config;
    return {
      imports: [
        ConfigModule,
        DiscoveryModule,
        includeCLS &&
          ClsModule.forRoot({
            middleware: { mount: true },
          }),
        MessengerModule,
      ],
      providers: [
        AggregateFactory,
        EventClient,
        EventBuilderFactory,
        IngestControllerEngine,
        MessagePublisher,
        RequestEngine,
        RequestMetadataMiddleware,
        {
          provide: APP_INTERCEPTOR,
          useClass: MetadataInterceptor,
        },
        {
          provide: APPLICATION_NAME,
          useValue: applicationName,
        },
        ...eventStoreConfig.providers,
      ],
      exports: [
        AggregateFactory,
        APPLICATION_NAME,
        EventClient,
        EventBuilderFactory,
        EVENT_LISTENER_FACTORY,
        ...eventStoreConfig.exports,
      ],
      module: CQRSCoreModule,
      global: true,
    };
  }
}
