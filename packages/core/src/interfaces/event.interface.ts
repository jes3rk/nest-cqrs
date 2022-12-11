import { IMessage } from "./message.interface";

export interface IEvent extends IMessage {
  $idempotentID: string;
}
