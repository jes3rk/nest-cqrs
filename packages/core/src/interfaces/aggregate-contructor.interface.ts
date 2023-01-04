export interface AggregateConstructor<T extends IAggregateRoot> {
  new (id: string): T;
}

export interface IAggregateRoot {
  id: string;
}
