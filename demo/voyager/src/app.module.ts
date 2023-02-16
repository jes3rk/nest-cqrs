import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AppController } from "./app.controller";
import { CQRSModule } from "@nest-cqrs/core";
import { configureEventStoreDB } from "@nest-cqrs/eventstoredb";
import { HotelModule } from "./hotel/hotel.module";
import { VoyageModule } from "./voyage/voyage.module";
import { TypeOrmModule } from "@nestjs/typeorm";

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
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: "postgres",
      dropSchema: true,
      host: "localhost",
      password: "cqrs",
      port: 5432,
      synchronize: true,
      type: "postgres",
      username: "postgres",
    }),
    VoyageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
