import { Event, IEvent } from "@nest-cqrs/core";
import { RegisterType } from "class-transformer-storage";
import { EventParser } from "./event.parser";

describe("EventParser", () => {
  let parser: EventParser;

  @RegisterType()
  class TestEvent extends Event implements IEvent {}

  beforeEach(() => {
    parser = new EventParser();
  });

  it("will format an event into the eventstore type", () => {
    const msg = new TestEvent();
    expect(parser.parseToJsonEvent(msg)).toMatchObject({
      data: {},
      id: msg.$uuid,
      metadata: msg.$metadata,
      type: msg.$name,
    });
  });

  it("will read an event correctly into the TestEvent class", () => {
    const msg = new TestEvent();
    expect(
      parser.readFromJsonEvent(parser.parseToJsonEvent(msg)),
    ).toMatchObject(msg);
  });
});
