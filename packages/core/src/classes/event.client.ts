import { Injectable } from "@nestjs/common";
import { MessageType } from "../cqrs.constants";
import { RequestEngine } from "../engine/request.engine";
import { IEvent } from "../interfaces/event.interface";
import { MessageRequest } from "./message-request.class";

@Injectable()
export class EventClient {
  constructor(private readonly engine: RequestEngine) {}

  /**
   * Emit events to the store and the wider ecosystem
   *
   * @param event Event to distribute
   */
  public async emit(event: IEvent): Promise<void> {
    const message = MessageRequest.generateRequest(event, MessageType.EVENT);
    return this.engine.handleMessageRequest(message);
  }
}
