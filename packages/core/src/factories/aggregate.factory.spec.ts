import { Injectable } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AggregateRoot } from "../classes/aggregate.root";
import { Event } from "../classes/_base.event";
import { EVENT_READER } from "../cqrs.constants";
import { Aggregate } from "../decorators/aggregate.decorator";
import { Apply } from "../decorators/apply.decorator";
import { IEventReader } from "../interfaces/event-reader.interface";
import { IEvent } from "../interfaces/event.interface";
import { AggregateFactory } from "./aggregate.factory";

describe("AggregateFactory", () => {
  let factory: AggregateFactory;
  let reader: MockEventReader;

  @Injectable()
  class MockEventReader implements IEventReader {
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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AggregateFactory,
        {
          provide: EVENT_READER,
          useClass: MockEventReader,
        },
      ],
    }).compile();

    factory = module.get(AggregateFactory);
    reader = module.get(EVENT_READER);
  });

  it("will be defined", () => {
    expect(factory).toBeDefined();
  });

  describe("loadAggregateFromStream", () => {
    class TestEvent extends Event implements IEvent {
      public $payload: Record<string, unknown> = {};
    }
    class DummyAggregate extends AggregateRoot {
      @Apply(TestEvent)
      handleTestEvent = jest.fn();
    }

    it("will load an existing aggregate", async () => {
      reader.EVENTS = [new TestEvent()];

      const agg = await factory.loadAggregateFromStream("", DummyAggregate);
      expect(agg).toBeInstanceOf(DummyAggregate);
      expect(agg.handleTestEvent).toHaveBeenCalledTimes(reader.EVENTS.length);
      reader.EVENTS.forEach((e) => {
        expect(agg.handleTestEvent).toHaveBeenCalledWith(e);
      });
      expect(agg.$updatedAt).toEqual(reader.EVENTS.at(-1).$timestamp);
    });

    it("will load a new aggregate", async () => {
      const agg = await factory.loadAggregateFromStream("", DummyAggregate);
      expect(agg).toBeInstanceOf(DummyAggregate);
      expect(agg.handleTestEvent).toHaveBeenCalledTimes(reader.EVENTS.length);
    });

    it("will handle an aggregate using the decorator", async () => {
      @Aggregate()
      class MixinAggregate {
        public $updatedAt: Date;

        constructor(public readonly id: string) {}

        @Apply(TestEvent)
        handleTestEvent = jest.fn();
      }

      reader.EVENTS = [new TestEvent()];

      const agg = await factory.loadAggregateFromStream("", MixinAggregate);
      expect(agg).toBeInstanceOf(MixinAggregate);
      expect(agg.handleTestEvent).toHaveBeenCalledTimes(reader.EVENTS.length);
      reader.EVENTS.forEach((e) => {
        expect(agg.handleTestEvent).toHaveBeenCalledWith(e);
      });
      expect(agg.$updatedAt).toEqual(reader.EVENTS.at(-1).$timestamp);
    });
  });
});
