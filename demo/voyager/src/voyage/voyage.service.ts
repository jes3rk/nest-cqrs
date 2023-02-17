import { Injectable } from "@nestjs/common";
import { AggregateFactory, EventBuilderFactory } from "@nest-cqrs/core";
import { IVoyage } from "../common/interfaces/voyage.interface";
import { randomUUID } from "crypto";
import { VoyageAggregate } from "./voyage.aggregate";
import { VoyageValidator } from "./voyage.validator";
import { DuplicateVoyageError } from "./exceptions/duplicate-voyage.exception";

@Injectable()
export class VoyageService {
  constructor(
    private readonly aggregateFactory: AggregateFactory,
    private readonly eventBuilderFactory: EventBuilderFactory,
    private readonly voyageValidator: VoyageValidator,
  ) {}

  public async createNewVoyage() {
    const aggregate = await this.aggregateFactory.loadAggregateFromStream(
      randomUUID(),
      VoyageAggregate,
    );
    if (!this.voyageValidator.isNewVoyage(aggregate))
      throw new DuplicateVoyageError();
  }
}
