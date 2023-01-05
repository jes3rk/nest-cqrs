import { RequestMetadata } from "./request.metadata";
import { IMessage, IMessageMetadata } from "./message.interface";

export interface IEventMetadata extends IMessageMetadata, RequestMetadata {
  $correlationId: string;
}

export interface IEvent extends IMessage {
  $metadata: IEventMetadata;
  $streamId: string;
}
