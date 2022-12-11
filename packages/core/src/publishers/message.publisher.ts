import { Inject, Injectable } from "@nestjs/common";
import { MessageRequest } from "../classes/message-request.class";
import { EVENT_PUBLISHER, MessageType } from "../cqrs.constants";
import { IPublisher } from "../interfaces/publisher.interface";

@Injectable()
export class MessagePublisher {
  constructor(
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IPublisher,
  ) {}

  public async publish(message: MessageRequest): Promise<void> {
    switch (message.messageType) {
      case MessageType.EVENT:
        return this.eventPublisher.publish(message.toPlainMessage());
    }
  }
}
