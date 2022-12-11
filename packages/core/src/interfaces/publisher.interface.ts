import { MessageRequest } from "../classes/message-request.class";

export interface IPublisher {
  publish(message: MessageRequest): Promise<void>;
}
