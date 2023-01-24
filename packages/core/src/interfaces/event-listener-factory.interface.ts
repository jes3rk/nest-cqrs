export interface EventListenerFactory {
  provideForNamespace(namespace: string): object;
}
