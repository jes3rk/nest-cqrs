import { faker } from "@faker-js/faker";
import { generateStreamID, initializeAndAddToArrayMap } from "./cqrs.utilites";
import { Aggregate } from "./decorators/aggregate.decorator";

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
  });
});
