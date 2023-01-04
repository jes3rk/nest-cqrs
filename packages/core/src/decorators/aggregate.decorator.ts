import { ClassConstructor } from "class-transformer";
import { AggregateRoot } from "../classes/aggregate.root";
import { AGGREGATE_METADATA } from "../cqrs.constants";
import { applyMixins } from "../cqrs.utilites";
import { AggregateConstructor } from "../interfaces/aggregate-contructor.interface";
import { AggregateMetadata } from "../interfaces/aggregate-metadata.interface";

/**
 * Alternative method of configuring AggregateRoots. Class decorated with
 * this decorator will be converted to AggregateRoot instances as well as
 * applied with the supplied metadata for configuration.
 *
 * @param metadata
 */
export const Aggregate = (metadata: AggregateMetadata = {}) => {
  return (target: AggregateConstructor<any>) => {
    Reflect.defineMetadata(AGGREGATE_METADATA, metadata, target);
    if (!(target.prototype instanceof AggregateRoot)) {
      applyMixins(target, [AggregateRoot]);
    }
  };
};
