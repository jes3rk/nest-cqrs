import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { Event } from "../classes/_base.event";
import { Aggregate } from "../decorators/aggregate.decorator";
import { IEvent } from "../interfaces/event.interface";
import { EventBuilderFactory } from "./event-builder.factory";

describe("EventFactory", () => {
  let factory: EventBuilderFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventBuilderFactory],
    }).compile();

    factory = module.get(EventBuilderFactory);
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
    expect(evt.$streamId).toEqual(`test.${agg.id}`);
  });
});
