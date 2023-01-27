import { Test } from "@nestjs/testing";
import { Event } from "../classes/_base.event";
import { IEvent } from "../interfaces/event.interface";
import { SubscriberFactory } from "./subscriber.factory";

describe("SubscriberFactory", () => {
  let factory: SubscriberFactory;

  class TestEvent extends Event implements IEvent {
    $payload: unknown;
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriberFactory,
          useClass: SubscriberFactory,
        },
      ],
    }).compile();

    factory = module.get(SubscriberFactory);
  });

  it("will be defined", () => {
    expect(factory).toBeDefined();
  });

  describe("observable", () => {
    let event: TestEvent;

    beforeEach(() => {
      event = new TestEvent();
    });

    it("will pass emitted events to generated observables", () => {
      const observable = factory.generateObservable();
      const observer = jest.fn();

      observable.subscribe(observer);

      factory.publishEvent(event);

      expect(observer).toHaveBeenCalledTimes(1);
      expect(observer).toHaveBeenCalledWith(event);
    });

    it("will de-reference observables that have been closed", () => {
      expect(factory["ee"].listenerCount("")).toEqual(0);
      const observable = factory.generateObservable();
      const sub = observable.subscribe(jest.fn());
      expect(factory["ee"].listenerCount("")).toEqual(1);
      sub.unsubscribe();
      expect(factory["ee"].listenerCount("")).toEqual(0);
    });
  });
});
