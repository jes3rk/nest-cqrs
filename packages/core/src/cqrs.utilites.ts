import { strictEqual } from "assert";
import { ClassConstructor } from "class-transformer";
import { ctPlainToInstance, CTStore } from "class-transformer-storage";
import { AGGREGATE_METADATA, EVENT_CONFIGURATION } from "./cqrs.constants";
import { IEvent, IEventMetadata } from "./interfaces/event.interface";
import { Event } from "./classes/_base.event";
import { IEventConfiguration } from "./interfaces/event-configuration.interface";

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
  aggregatePrototype: ClassConstructor<any> | string,
): string {
  const aggregateName =
    typeof aggregatePrototype === "string"
      ? aggregatePrototype
      : Reflect.getMetadata(AGGREGATE_METADATA, aggregatePrototype)?.name ||
        aggregatePrototype.name.replace(/([Aa]ggregate)/, "");
  return prefix + "." + aggregateName.toLowerCase() + "." + aggregateId;
}

export function upcastAndTransformEvent(rawEvent: IEvent): IEvent {
  const constructor = CTStore.get(rawEvent.$name);
  const metadata: IEventConfiguration = Reflect.getMetadata(
    EVENT_CONFIGURATION,
    constructor,
  );
  return ctPlainToInstance(
    metadata?.versioner
      ? new metadata.versioner().upcastToVersion(rawEvent)
      : rawEvent,
    { getName: (plain) => plain["$name"] },
  );
}

export function parseStreamID(streamId: string): {
  appName: string;
  aggregateName: string;
  id: string;
} {
  const split = streamId.split(".");
  strictEqual(split.length, 3, "Unparsable StreamID");
  return {
    appName: split[0],
    aggregateName: split[1],
    id: split[2],
  };
}
