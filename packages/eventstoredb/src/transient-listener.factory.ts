import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { IEvent, APPLICATION_NAME } from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import { AllStreamSubscription, streamNameFilter } from "@eventstore/db-client";
import { EventParser } from "./utils/event.parser";
import { JSONEvent } from "./types/json-event-type";

@Injectable()
export class TransientSubscriptionFactory
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private subject: Subject<IEvent>;
  private subscription: AllStreamSubscription;
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
    private readonly client: EventStoreClient,
  ) {
    this.subject = new Subject<IEvent>();
  }

  beforeApplicationShutdown() {
    this.subscription.destroy();
    this.subject.complete();
  }

  public createTransientSubscription(): Observable<IEvent> {
    return this.subject.asObservable();
  }

  onApplicationBootstrap() {
    this.subscription = this.client.client.subscribeToAll({
      filter: streamNameFilter({
        prefixes: [`${this.applicationName}.`],
      }),
    });
    const parser = new EventParser();
    this.subscription.on("data", async (data) => {
      try {
        const { event } = data;
        if (!event) {
          return;
        }
        const parsed = parser.readFromJsonEvent(event as unknown as JSONEvent);
        this.subject.next(parsed);
      } catch (err) {
        console.log(err);
      }
    });
  }
}
