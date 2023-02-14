import { Message, MessageMetadata } from "./_base.message";
import { Type } from "class-transformer";
import { IEvent, IEventMetadata } from "../interfaces/event.interface";

export class EventMetadata extends MessageMetadata implements IEventMetadata {
  public $correlationId: string;
}

export abstract class Event extends Message {
  @Type(() => EventMetadata)
  public readonly $metadata: EventMetadata;
  public readonly $streamId: string;

  constructor() {
    super();
    this.$metadata = new EventMetadata();
  }
}
