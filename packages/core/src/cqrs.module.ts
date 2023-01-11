import { DynamicModule, Global, Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { EventClient } from "./classes/event.client";
import { RequestEngine } from "./engine/request.engine";
import { PluginConfiguration } from "./interfaces/plugin-config.interface";
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

@Module({
  imports: [DiscoveryModule, MessengerModule],
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
  ],
  exports: [AggregateFactory, EventClient, EventBuilderFactory],
})
export class CQRSModule {
  /**
   * Configure the module at the root level. Will automatically import
   * the config module and other required modules.
   */
  public static forRoot(config: CQRSModuleConfig): DynamicModule {
    const { includeCLS = true, eventStoreConfig } = config;
    return {
      imports: [
        ConfigModule,
        includeCLS &&
          ClsModule.forRoot({
            middleware: { mount: true },
          }),
      ],
      providers: [...eventStoreConfig.providers],
      exports: [...eventStoreConfig.exports],
      module: CQRSModule,
      global: true,
    };
  }
}
