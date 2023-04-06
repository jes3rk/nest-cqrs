import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { IEvent, APPLICATION_NAME } from "@nest-cqrs/core";
import {
  consumerOpts,
  createInbox,
  JetStreamSubscription,
  JSONCodec,
} from "nats";
import { NatsClient } from "./nats.client";
import { ctPlainToInstance } from "class-transformer-storage";

@Injectable()
export class TransientSubscriptionFactory
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private subject: Subject<IEvent>;
  private subscription: JetStreamSubscription;
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
    private readonly client: NatsClient,
  ) {
    this.subject = new Subject<IEvent>();
  }

  beforeApplicationShutdown() {
    this.subject.complete();
  }

  public createTransientSubscription(): Observable<IEvent> {
    return this.subject.asObservable();
  }

  public async onApplicationBootstrap() {
    const consumerOptions = consumerOpts();
    consumerOptions.callback((err, msg) => {
      if (err) return;
      if (msg) {
        const decoded = JSONCodec().decode(msg.data);
        const parsed = ctPlainToInstance(decoded, {
          getName(plain) {
            return plain["$name"];
          },
        });
        this.subject.next(parsed);
      }
    });
    consumerOptions.deliverTo(createInbox());
    this.subscription = await this.client.jetstreamClient.subscribe(
      `${this.applicationName}.>`,
      consumerOptions,
    );
  }
}
