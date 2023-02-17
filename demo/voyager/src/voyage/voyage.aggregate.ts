import { Aggregate } from "@nest-cqrs/core";
import { IVoyage, IVoyageLeg } from "../common/interfaces/voyage.interface";

@Aggregate()
export class VoyageAggregate implements IVoyage {
  createdAt: Date;
  travelerId: string;
  legs: IVoyageLeg[];

  constructor(public readonly id: string) {}
}
