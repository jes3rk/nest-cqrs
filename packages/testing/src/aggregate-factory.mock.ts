import { AggregateFactory, APPLICATION_NAME, IEvent } from "@nest-cqrs/core";
import { Inject, Injectable } from "@nestjs/common";
import { MockEventReader } from "./event-reader.mock";

@Injectable()
export class AggregateFactoryMock extends AggregateFactory {
  private _read: MockEventReader;
  constructor(@Inject(APPLICATION_NAME) applicationName: string) {
    const read = new MockEventReader();
    super(applicationName, read);
    this._read = read;
  }

  public set EVENTS(events: IEvent[]) {
    this._read.EVENTS = events;
  }
}
