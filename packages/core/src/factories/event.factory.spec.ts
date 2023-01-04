import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { AggregateRoot } from "../classes/aggregate.root";
import { Event } from "../classes/_base.event";
import { Aggregate } from "../decorators/aggregate.decorator";
import { IEvent } from "../interfaces/event.interface";
import { EventFactory } from "./event.factory";

describe("EventFactory", () => {
  let factory: EventFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventFactory],
    }).compile();

    factory = module.get(EventFactory);
  });

  it("will be defined", () => {
    expect(factory).toBeDefined();
  });

  it("will construct a new event with the aggregate streamId", () => {
    class TestEvent extends Event implements IEvent {
      public $payload: unknown;
    }
    @Aggregate()
    class TestAggregate {
      constructor(public readonly id: string) {}
    }

    const agg = new TestAggregate(faker.datatype.uuid());
    const evt = factory
      .generateEventBuilder(agg)
      .addEventType(TestEvent)
      .addPayload({})
      .build()[0];

    expect(evt).toBeInstanceOf(TestEvent);
    expect(evt.$streamID).toEqual(`test.${agg.id}`);
  });
});
