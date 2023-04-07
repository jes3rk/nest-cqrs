import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { IEvent, APPLICATION_NAME } from "@nest-cqrs/core";
import { JSONCodec, Subscription } from "nats";
import { NatsClient } from "./nats.client";
import { ctPlainToInstance } from "class-transformer-storage";

@Injectable()
export class TransientSubscriptionFactory
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private subject: Subject<IEvent>;
  private subscription: Subscription;
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
    this.subscription = this.client.client.subscribe(
      `${this.applicationName}.>`,
      // consumerOptions,
      {
        callback: (err, msg) => {
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
        },
      },
    );
  }
}
