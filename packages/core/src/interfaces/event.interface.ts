import { IMessage } from "./message.interface";

export interface IEvent extends IMessage {
  $correlationId: string;
  $streamID: string;
  $timestamp: Date;
}
