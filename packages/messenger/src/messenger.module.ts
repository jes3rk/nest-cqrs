import { Module } from "@nestjs/common";
import { MessengerService } from "./messenger.service";

@Module({
  imports: [MessengerService],
  exports: [MessengerService],
})
export class MessengerModule {}
