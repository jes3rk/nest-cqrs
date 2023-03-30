import { SubscriberFactory } from "../factories/subscriber.factory";

export interface EventListenerFactory {
  provideForNamespace(namespace: string): object;
}
