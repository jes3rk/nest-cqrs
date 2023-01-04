import { Message } from "./_base.message";

export abstract class Event extends Message {
  public readonly $correlationId: string;
  public readonly $streamID: string;
}
