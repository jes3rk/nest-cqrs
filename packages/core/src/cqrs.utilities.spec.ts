import { faker } from "@faker-js/faker";
import { initializeAndAddToArrayMap } from "./cqrs.utilites";

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
});
