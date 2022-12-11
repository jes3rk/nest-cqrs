import { Message } from "./_base.message";

export abstract class Event extends Message {
  public readonly $idempotentID: string;
}
