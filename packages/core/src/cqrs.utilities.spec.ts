import { faker } from "@faker-js/faker";
import { Event } from "./classes/_base.event";
import { instanceToPlain } from "class-transformer";
import { EventVersioner } from "./classes/_base.event-versioner";
import {
  generateStreamID,
  initializeAndAddToArrayMap,
  parseStreamID,
  upcastAndTransformEvent,
} from "./cqrs.utilites";
import { Aggregate } from "./decorators/aggregate.decorator";
import { IEvent } from "./interfaces/event.interface";
import { EventConfiguration } from "./decorators/event-configuration.decorator";
import { IEventVersioner } from "./interfaces/event-versioner.interface";

describe("Utilities", () => {
  describe("initializeAndAddToArrayMap", () => {
    it("will add a new key and value", () => {
      const map = new Map<string, string[]>();
      const key = faker.random.word();
      const value = faker.random.word();

      initializeAndAddToArrayMap(map, key, value);
      expect(map.size).toEqual(1);
      expect(map.get(key)).toEqual([value]);
    });

    it("will append to an existing key", () => {
      const map = new Map<string, string[]>();
      const key = faker.random.word();
      const value = faker.random.word();

      map.set(key, [faker.random.word()]);

      initializeAndAddToArrayMap(map, key, value);
      expect(map.size).toEqual(1);
      expect(map.get(key)).toMatchObject([expect.any(String), value]);
    });
  });

  describe("generateStreamID", () => {
    let id: string;
    let prefix: string;

    beforeEach(() => {
      id = faker.datatype.uuid();
      prefix = faker.random.alpha(4);
    });

    it("will generate a parsed name from the aggregate", () => {
      class DummyAggregate {}
      expect(generateStreamID(prefix, id, DummyAggregate)).toEqual(
        `${prefix}.dummy.${id}`,
      );
    });

    it("will allow overriding the default name", () => {
      @Aggregate({ name: "hello" })
      class DummyAggregate {}

      expect(generateStreamID(prefix, id, DummyAggregate)).toEqual(
        `${prefix}.hello.${id}`,
      );
    });

    it("will function with a string name", () => {
      expect(generateStreamID(prefix, id, "hello")).toEqual(
        `${prefix}.hello.${id}`,
      );
    });
  });

  describe("upcastAndTransformEvent", () => {
    class TemplateEventVersioner
      extends EventVersioner
      implements IEventVersioner
    {
      public upcastToVersion(event: IEvent): IEvent {
        switch (event.$version) {
          case 1:
            return this.upcastToVersion({
              ...event,
              $payload: "default string",
              $version: 2,
            });
          default:
            return event;
        }
      }
    }

    @EventConfiguration({
      versioner: TemplateEventVersioner,
    })
    class TemplateEvent extends Event implements IEvent {
      public readonly $version: number = 2;
      public readonly $payload: string;
    }

    it("will pass an event already at the latest version", () => {
      const event = instanceToPlain(new TemplateEvent());

      expect(upcastAndTransformEvent(event as IEvent)).toBeInstanceOf(
        TemplateEvent,
      );
    });

    it("will upgrade an event that is in an older version", () => {
      const event = instanceToPlain(new TemplateEvent());
      event.$version = 1;
      event.$payload = undefined;

      const upcastedEvent = upcastAndTransformEvent(event as IEvent);
      expect(upcastedEvent).toBeInstanceOf(TemplateEvent);
      expect(upcastedEvent.$version).toEqual(2);
      expect(upcastedEvent.$payload).toEqual(expect.any(String));
    });
  });

  describe("parseStreamID", () => {
    let appName: string;
    let id: string;

    class DummyAggregate {}

    beforeEach(() => {
      appName = faker.random.word();
      id = faker.datatype.uuid();
    });

    it("will parse a generated streamID", () => {
      const streamID = generateStreamID(appName, id, DummyAggregate);
      expect(parseStreamID(streamID)).toEqual({
        appName,
        id,
        aggregateName: "dummy",
      });
    });

    it("will throw an error with an incorrect id", () => {
      const streamID = faker.random.word();
      expect(() => parseStreamID(streamID)).toThrowError();
    });
  });
});
