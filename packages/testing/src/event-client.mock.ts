import { IEvent } from "packages/core/dist";

export class EventClientMock {
  public emit = jest.fn();
  public emitMany = jest.fn((events: IEvent[]) =>
    events.forEach((e) => this.emit(e)),
  );
}
