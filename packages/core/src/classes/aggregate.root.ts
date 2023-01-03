import { APPLY_METADATA } from "../cqrs.constants";
import { IEvent } from "../interfaces/event.interface";

export abstract class AggregateRoot {
  private _applyMap: Map<IEvent["$name"], keyof this>;
  public $updatedAt: Date;

  public apply(event: IEvent): void {
    if (!this._applyMap) {
      this._applyMap = Reflect.getMetadata(APPLY_METADATA, this);
    }
    if (this._applyMap.has(event.$name))
      (this[this._applyMap.get(event.$name)] as (event: IEvent) => void).call(
        this,
        event,
      );
    this.$updatedAt = event.$timestamp;
  }
}
