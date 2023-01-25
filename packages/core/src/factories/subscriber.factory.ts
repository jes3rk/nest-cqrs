import { IEvent } from "../interfaces/event.interface";
import { Observable } from "rxjs";
import { EventEmitter } from "events";

/**
 * Utility class for enabling subscriptions to events ingested
 * on a given node. Useful for websocket pushes of events
 * to clients.
 */
export class SubscriberFactory {
  private ee: EventEmitter;

  constructor() {
    this.ee = new EventEmitter();
  }

  /**
   * @internal
   * Publish and event to all subscribers
   */
  public publishEvent(event: IEvent): void {
    this.ee.emit("", event);
  }

  /**
   * Create an observable tied to the subscription
   */
  public generateObservable(): Observable<IEvent> {
    return new Observable<IEvent>((sub) => {
      const handler = (e: IEvent) => sub.next(e);
      this.ee.addListener("", handler);
      return () => this.ee.removeListener("", handler);
    });
  }
}
