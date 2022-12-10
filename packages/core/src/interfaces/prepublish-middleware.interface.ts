import { IMessage } from "./message.interface";

export interface IPrePublishMiddleware {
  apply(message: IMessage): IMessage | Promise<IMessage>;
}
