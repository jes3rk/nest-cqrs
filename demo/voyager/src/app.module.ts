import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AppController } from "./app.controller";
import { CQRSModule } from "@nest-cqrs/core";
import { configureEventStoreDB } from "@nest-cqrs/eventstoredb";
import { HotelModule } from "./hotel/hotel.module";
import { VoyageModule } from "./voyage/voyage.module";

@Module({
  imports: [
    HotelModule,
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
    VoyageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
