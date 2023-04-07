import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AccountingModule } from "./accounting/accounting.module";
import { AppController } from "./app.controller";
import { CQRSModule, PluginConfiguration } from "@nest-cqrs/core";
import { configureEventStoreDB } from "@nest-cqrs/eventstoredb";
import { configureNats } from "@nest-cqrs/nats";

const generateEventStoreConfig = (): PluginConfiguration => {
  const storeType = process.env.STORE_TYPE || "eventstoredb";
  switch (storeType) {
    case "eventstoredb":
      return configureEventStoreDB({
        eventStoreConfig: {
          useValue: {
            connectionString:
              "esdb://localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000",
          },
        },
      });
    case "nats":
      return configureNats({
        eventStoreConfig: {
          useValue: {
            connection: {
              servers: "localhost",
            },
          },
        },
      });
    default:
      throw new Error("Unsupported event store");
  }
};

@Module({
  imports: [
    CQRSModule.forRoot({
      applicationName: "demo",
      eventStoreConfig: generateEventStoreConfig(),
    }),
    MessengerModule,
    AccountingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
