import {
  BeforeApplicationShutdown,
  OnApplicationBootstrap,
} from "@nestjs/common";
import {
  IEvent,
  IngestControllerEngine,
  MessageRequest,
  MessageType,
  SubscriberFactory,
} from "@nest-cqrs/core";
import { EventStoreClient } from "./eventstore.client";
import {
  DISPATCH_TO_SINGLE,
  PARK,
  PersistentSubscriptionExistsError,
  PersistentSubscriptionToAll,
  persistentSubscriptionToAllSettingsFromDefaults,
  streamNameFilter,
} from "@eventstore/db-client";
import { EventParser } from "./utils/event.parser";
import { JSONEvent } from "./types/json-event-type";

export class EventStoreListener
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private subscription: PersistentSubscriptionToAll;

  constructor(
    private readonly applicationName: string,
    private readonly client: EventStoreClient,
    private readonly ingestEngine: IngestControllerEngine,
    private readonly namespace: string,
    private readonly subscriberFactory: SubscriberFactory,
  ) {}

  private async initSubscriptionGroupIfNotExists(): Promise<void> {
    try {
      await this.client.client.createPersistentSubscriptionToAll(
        this.namespace,
        persistentSubscriptionToAllSettingsFromDefaults({
          consumerStrategyName: DISPATCH_TO_SINGLE,
        }),
        {
          filter: streamNameFilter({
            prefixes: [`${this.applicationName}.`],
          }),
        },
      );
    } catch (err) {
      // If the subscription group already exists, that's fine
      if (!(err instanceof PersistentSubscriptionExistsError)) throw err;
    }
  }

  private async runSubscription(
    subscription: PersistentSubscriptionToAll,
  ): Promise<void> {
    const parser = new EventParser();
    subscription.on("data", async (data) => {
      try {
        const { event } = data;
        if (!event) {
          await subscription.nack(PARK, "no message content", data);
          return;
        }
        const messageRequest = MessageRequest.ingestMessage(
          parser.readFromJsonEvent(event as unknown as JSONEvent),
          MessageType.EVENT,
          this.namespace,
        );
        await this.ingestEngine.handleIngestRequest(messageRequest);
        this.subscriberFactory.publishEvent(messageRequest.message as IEvent);
        await subscription.ack(data);
      } catch (err) {
        console.log(err);
        await subscription.nack(PARK, err.toString(), data);
      }
    });
  }

  public async onApplicationBootstrap() {
    await this.initSubscriptionGroupIfNotExists();
    this.subscription =
      this.client.client.subscribeToPersistentSubscriptionToAll(
        this.namespace,
        {
          bufferSize: 128,
        },
      );
    this.runSubscription(this.subscription);
  }

  public async beforeApplicationShutdown() {
    await this.subscription.unsubscribe();
  }
}
