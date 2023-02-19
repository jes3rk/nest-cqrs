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
   * @param event Event or events to distribute
   */
  public async emit(event: IEvent | IEvent[]): Promise<void> {
    if (Array.isArray(event)) return this.emitMany(event);
    return this.emitMany([event]);
  }

  /**
   * Emit events to the store and the wider ecosystem
   *
   * @param event Event or events to distribute
   * @deprecated Will be removed from the public API
   */
  public async emitMany(events: IEvent[]): Promise<void> {
    const messages = events.map((e) =>
      MessageRequest.generateRequest(e, MessageType.EVENT),
    );
    await this.engine.handleMessageRequests(messages);
  }
}
