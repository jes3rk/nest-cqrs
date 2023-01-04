import { DynamicModule, Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { EventClient } from "./classes/event.client";
import { RequestEngine } from "./engine/request.engine";
import { PluginConfiguration } from "./interfaces/plugin-config.interface";
import { MessagePublisher } from "./publishers/message.publisher";
import { ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { EventFactory } from "./factories/event.factory";

@Module({
  imports: [DiscoveryModule, MessengerModule],
  providers: [EventClient, EventFactory, MessagePublisher, RequestEngine],
  exports: [EventClient, EventFactory],
})
export class CQRSModule {
  /**
   * Configure the module at the root level. Will automatically import
   * the config module and other required modules.
   */
  public static forRoot(config: {
    eventStoreConfig: PluginConfiguration;
  }): DynamicModule {
    return {
      imports: [ConfigModule],
      providers: [...config.eventStoreConfig.providers],
      exports: [...config.eventStoreConfig.exports],
      module: CQRSModule,
      global: true,
    };
  }
}
