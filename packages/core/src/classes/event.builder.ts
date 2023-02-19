import { ClassConstructor } from "class-transformer";
import { IEvent, IEventMetadata } from "../interfaces/event.interface";
import { EventMetadata } from "./_base.event";

/**
 * Builder class for generating one or more events from an intial
 * aggregate as well as coordinating metadata for all events in a
 * single place.
 */
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

  /**
   * Set the metadata for all events to be generated
   */
  public setMetadata(metadata: Partial<IEventMetadata>): EventBuilder {
    this.metadata = metadata;
    return this;
  }

  public setStreamId(streamId: string): EventBuilder {
    this.streamId = streamId;
    return this;
  }

  /**
   * Add an instance of a the event to the build script
   */
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

  /**
   * Generate all events and return
   */
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
