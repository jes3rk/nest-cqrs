import { IMessage } from "./message.interface";

export interface IPreProcessMiddleware {
  apply(message: IMessage): IMessage | Promise<IMessage>;
}
