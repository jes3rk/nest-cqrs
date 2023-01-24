import { ClassConstructor } from "class-transformer";
import { AGGREGATE_METADATA } from "./cqrs.constants";

/**
 * From {@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype)
      .filter((name) => name !== "constructor")
      .forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null),
        );
      });
  });
}
/**
 * Given a `map` of keys and value arrays, create the key if it
 * doesn't exist and append the provided value to the array.
 *
 * @param map
 * @param key
 * @param value
 */
export function initializeAndAddToArrayMap<K, V>(
  map: Map<K, V[]>,
  key: K,
  value: V,
): void {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

export function generateStreamID(
  prefix: string,
  aggregateId: string,
  aggregatePrototype: ClassConstructor<any>,
): string {
  const aggregateName =
    Reflect.getMetadata(AGGREGATE_METADATA, aggregatePrototype)?.name ||
    aggregatePrototype.name.replace(/([Aa]ggregate)/, "");
  return prefix + "." + aggregateName.toLowerCase() + "." + aggregateId;
}
