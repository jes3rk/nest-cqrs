import { Test } from "@nestjs/testing";
import { Subject } from "rxjs";
import { Event } from "../classes/_base.event";
import { TRANSIENT_LISTENER } from "../cqrs.constants";
import { IEvent } from "../interfaces/event.interface";
import { SubscriberFactory } from "./subscriber.factory";

describe("SubscriberFactory", () => {
  let factory: SubscriberFactory;
  let listener: Subject<IEvent>;

  class TestEvent extends Event implements IEvent {
    $payload: unknown;
    $version: 1;
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubscriberFactory,
        {
          provide: TRANSIENT_LISTENER,
          useFactory() {
            return new Subject<IEvent>();
          },
        },
      ],
    }).compile();

    factory = module.get(SubscriberFactory);
    listener = module.get(TRANSIENT_LISTENER);
  });

  it("will be defined", () => {
    expect(factory).toBeDefined();
  });

  describe("generateObservable", () => {
    let event: TestEvent;

    beforeEach(() => {
      event = new TestEvent();
    });

    it("will pass emitted events to generated observables", () => {
      const observable = factory.generateObservable();
      const observer = jest.fn();

      observable.subscribe(observer);

      listener.next(event);

      expect(observer).toHaveBeenCalledTimes(1);
      expect(observer).toHaveBeenCalledWith(event);
    });
  });
});
