import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AppController } from "./app.controller";

@Module({
  imports: [MessengerModule],
  controllers: [AppController],
})
export class AppModule {}
