import { IEvent } from "../interfaces/event.interface";
import { from, Observable, Subscription } from "rxjs";
import { EventEmitter } from "events";
import {
  Inject,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { TRANSIENT_LISTENER } from "../cqrs.constants";

/**
 * Utility class for enabling subscriptions to events ingested
 * on a given node. Useful for websocket pushes of events
 * to clients.
 */
export class SubscriberFactory
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private ee: EventEmitter;
  private rootSubscription: Subscription;

  constructor(
    @Inject(TRANSIENT_LISTENER)
    private readonly transientSubscription: Observable<IEvent>,
  ) {
    this.ee = new EventEmitter();
  }

  public onApplicationShutdown() {
    this.rootSubscription.unsubscribe();
  }

  public onApplicationBootstrap() {
    this.rootSubscription = this.transientSubscription.subscribe({
      next: (value) => {
        this.ee.emit("", value);
      },
    });
  }

  /**
   * Create an observable tied to the subscription
   */
  public generateObservable(): Observable<IEvent> {
    return from(this.transientSubscription);
  }
}
