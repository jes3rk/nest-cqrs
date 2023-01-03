import { Type } from "class-transformer";
import { randomUUID } from "crypto";
import { IMessageMetadata } from "../interfaces/message.interface";

export class MessageMetadata implements IMessageMetadata {}

export abstract class Message {
  @Type(() => MessageMetadata)
  public readonly $metadata: MessageMetadata;
  public readonly $name: string;
  @Type(() => Date)
  public readonly $timestamp: Date;
  public readonly $uuid: string;

  constructor() {
    this.$name = this.constructor.name;
    this.$timestamp = new Date();
    this.$uuid = randomUUID();
  }
}
