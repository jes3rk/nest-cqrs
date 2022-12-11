import { IMessage } from "./message.interface";

export interface IPublisher {
  publish(message: IMessage): Promise<void>;
}
