import { Aggregate, Apply } from "@nest-cqrs/core";
import { VoyageCreatedEvent } from "../common/events/voyage-created.event";
import { IVoyage, IVoyageLeg } from "../common/interfaces/voyage.interface";

@Aggregate()
export class VoyageAggregate implements IVoyage {
  createdAt: Date;
  travelerId: string;
  legs: IVoyageLeg[];

  constructor(public readonly id: string) {}

  @Apply(VoyageCreatedEvent)
  applyVoyageCreated(event: VoyageCreatedEvent): void {
    this.createdAt = event.$metadata.$timestamp;
    this.legs = [];
    this.travelerId = event.$payload.travelerId;
  }
}
