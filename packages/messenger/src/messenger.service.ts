import { Injectable } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { randomUUID } from "crypto";
import { EventEmitter } from "events";
import { InvalidSubscriptionIdException } from "./invalid-subscription-id.exception";
import { Message } from "./message.class";

type HandlerFn<T extends Message> = (message: T) => void | Promise<void>;

@Injectable()
export class MessengerService {
  private ee: EventEmitter;
  private subscriptions: Map<
    string,
    {
      message: Message["name"];
      handler: HandlerFn<Message>;
    }
  >;

  constructor() {
    this.ee = new EventEmitter();
    this.subscriptions = new Map();
  }

  /**
   * Emit a message to all relevant subscribers
   *
   * @param message
   */
  public emit(message: Message): void {
    this.ee.emit(message.name, message);
  }

  /**
   * Subscribe to a given message and handle
   *
   * @param message Message to subscribe to
   * @param handler Handler for the messages
   * @returns Subscription ID
   */
  public subscribe<T extends Message>(
    message: ClassConstructor<T>,
    handler: HandlerFn<T>,
  ): string {
    const subId = randomUUID();
    this.subscriptions.set(subId, {
      message: message.name,
      handler,
    });
    this.ee.addListener(message.name, handler);
    return subId;
  }

  /**
   * Unsubscribe from future messages
   *
   * @param subscriptionId
   * @throws InvalidSubscriptionIdException
   */
  public unsubscribe(subscriptionId: string): void {
    if (!this.subscriptions.has(subscriptionId))
      throw new InvalidSubscriptionIdException(subscriptionId);
    const { message, handler } = this.subscriptions.get(subscriptionId);
    this.ee.removeListener(message, handler);
  }
}
