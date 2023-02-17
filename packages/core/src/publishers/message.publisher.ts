import { Inject, Injectable } from "@nestjs/common";
import { MessageRequest } from "../classes/message-request.class";
import { EVENT_PUBLISHER, MessageType } from "../cqrs.constants";
import { initializeAndAddToArrayMap } from "../cqrs.utilites";
import { IPublisher } from "../interfaces/publisher.interface";

@Injectable()
export class MessagePublisher {
  constructor(
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IPublisher,
  ) {}

  public async publish(messages: MessageRequest[]): Promise<void> {
    const messagesMap = new Map<MessageType, MessageRequest[]>();
    messages.forEach((message) =>
      initializeAndAddToArrayMap(messagesMap, message.messageType, message),
    );
    await this.eventPublisher.publish(
      messagesMap
        .get(MessageType.EVENT)
        .map((message) => message.toPlainMessage()),
    );
  }
}
