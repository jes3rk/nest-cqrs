import { IEvent, IEventReader } from "@nest-cqrs/core";

export class MockEventReader implements IEventReader {
  public EVENTS: IEvent[];

  constructor() {
    this.EVENTS = [];
  }

  public readStreamAsynchronously(
    _: string,
    callback: (event: IEvent) => void,
  ): Promise<void> {
    this.EVENTS.forEach((e) => callback(e));
    return;
  }
}
