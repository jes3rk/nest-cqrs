import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AppController } from "./app.controller";
import { CQRSModule } from "@nest-cqrs/core";
import { configureEventStoreDB } from "@nest-cqrs/eventstoredb";

@Module({
  imports: [
    CQRSModule.forRoot({
      applicationName: "voyager",
      eventStoreConfig: configureEventStoreDB({
        eventStoreConfig: {
          useValue: {
            connectionString:
              "esdb://localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000",
          },
        },
      }),
    }),
    MessengerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
