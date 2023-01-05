import { ClassConstructor } from "class-transformer";
import { IEvent } from "../interfaces/event.interface";
import { EventMetadata } from "./_base.event";

export class EventBuilder {
  private correlationId: string;
  private streamId: string;
  private eventConstructors: {
    constructor: ClassConstructor<IEvent>;
    payload: IEvent["$payload"];
  }[];

  constructor() {
    this.eventConstructors = [];
  }

  public setCorrelationId(correlationId: string): EventBuilder {
    this.correlationId = correlationId;
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
      evt.$metadata.$correlationId = this.correlationId;
      evt.$payload = c.payload;
      evt.$streamId = this.streamId;
      return evt;
    });
  }
}
