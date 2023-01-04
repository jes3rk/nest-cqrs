import { AggregateFactory, IEvent } from "@nest-cqrs/core";
import { Injectable } from "@nestjs/common";
import { MockEventReader } from "./event-reader.mock";

@Injectable()
export class AggregateFactoryMock extends AggregateFactory {
  private _read: MockEventReader;
  constructor() {
    const read = new MockEventReader();
    super(read);
    this._read = read;
  }

  public set EVENTS(events: IEvent[]) {
    this._read.EVENTS = events;
  }
}
