import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { EventClient } from "./classes/event.client";
import { RequestEngine } from "./engine/request.engine";
import { MessagePublisher } from "./publishers/message.publisher";

@Module({
  imports: [MessengerModule],
  providers: [EventClient, MessagePublisher, RequestEngine],
  exports: [EventClient],
})
export class CQRSModule {}
