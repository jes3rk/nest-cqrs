import { APPLY_METADATA } from "../cqrs.constants";
import { IEvent } from "../interfaces/event.interface";

/**
 * Base class for an Aggregate that provides key methods for
 * instansiating and using aggregates.
 */
export abstract class AggregateRoot {
  private _applyMap: Map<IEvent["$name"], keyof this>;
  public $updatedAt: Date;

  constructor(public readonly id: string) {}

  /**
   * Core method to apply events to an aggregate
   */
  public apply(event: IEvent): void {
    if (!this._applyMap) {
      this._applyMap = Reflect.getMetadata(APPLY_METADATA, this);
    }
    if (this._applyMap.has(event.$name))
      (this[this._applyMap.get(event.$name)] as (event: IEvent) => void).call(
        this,
        event,
      );
    this.$updatedAt = event.$metadata.$timestamp;
  }
}
