import { Type } from "class-transformer";
import { randomUUID } from "crypto";
import { IMessageMetadata } from "../interfaces/message.interface";

export class MessageMetadata implements IMessageMetadata {}

export abstract class Message {
  @Type(() => MessageMetadata)
  public readonly $metadata: MessageMetadata;
  public readonly $name: string;
  public readonly $uuid: string;

  constructor() {
    this.$name = this.constructor.name;
    this.$uuid = randomUUID();
  }
}
