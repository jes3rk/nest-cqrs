import { IMessage } from "../interfaces/message.interface";

export class FailedToPublishMessagesException extends Error {
  constructor(public readonly failedMessages: IMessage[]) {
    super("Failed to publish messages");
    this.name = this.constructor.name;
  }
}
