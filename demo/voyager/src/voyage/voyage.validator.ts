import { Injectable } from "@nestjs/common";
import { VoyageAggregate } from "./voyage.aggregate";

@Injectable()
export class VoyageValidator {
  public isNewVoyage(voyage: VoyageAggregate): boolean {
    return voyage.createdAt === undefined;
  }
}
