import { ClassConstructor } from "class-transformer";
import { IEvent, IEventMetadata } from "../interfaces/event.interface";
import { EventMetadata } from "./_base.event";

export class EventBuilder {
  private metadata: Partial<IEventMetadata>;
  private streamId: string;
  private eventConstructors: {
    constructor: ClassConstructor<IEvent>;
    payload: IEvent["$payload"];
  }[];

  constructor() {
    this.eventConstructors = [];
  }

  public setMetadata(metadata: Partial<IEventMetadata>): EventBuilder {
    this.metadata = metadata;
    return this;
  }

  public setStreamId(streamId: string): EventBuilder {
    this.streamId = streamId;
    return this;
  }

  public addEventType<T extends IEvent>(constructor: ClassConstructor<T>) {
    return {
      addPayload: (payload: T["$payload"]): EventBuilder => {
        this.eventConstructors.push({
          constructor,
          payload,
        });
        return this;
      },
    };
  }

  public build(): IEvent[] {
    return this.eventConstructors.map((c) => {
      const evt = new c.constructor();
      evt.$metadata = { ...evt.$metadata, ...(this.metadata || {}) };
      evt.$payload = c.payload;
      evt.$streamId = this.streamId;
      return evt;
    });
  }
}
