import { IMessage, IMessageMetadata } from "./message.interface";

export interface IEventMetadata extends IMessageMetadata {
  $correlationId: string;
}

export interface IEvent extends IMessage {
  $metadata: IEventMetadata;
  $streamId: string;
}
