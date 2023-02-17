import { Injectable } from "@nestjs/common";
import {
  AggregateFactory,
  EventBuilderFactory,
  EventClient,
  IngestControllerEngine,
} from "@nest-cqrs/core";
import { IVoyage } from "../common/interfaces/voyage.interface";
import { randomUUID } from "crypto";
import { VoyageAggregate } from "./voyage.aggregate";
import { VoyageValidator } from "./voyage.validator";
import { DuplicateVoyageError } from "./exceptions/duplicate-voyage.exception";
import { VoyageCreatedEvent } from "../common/events/voyage-created.event";
import { CreateVoyageInput } from "./dto/create-voyage.input";
import { VoyageReponse } from "./dto/voyage-response.dto";

@Injectable()
export class VoyageService {
  constructor(
    private readonly aggregateFactory: AggregateFactory,
    private readonly eventBuilderFactory: EventBuilderFactory,
    private readonly eventClient: EventClient,
    private readonly voyageValidator: VoyageValidator,
  ) {}

  public async createNewVoyage(
    input: CreateVoyageInput,
  ): Promise<VoyageReponse> {
    const aggregate = await this.aggregateFactory.loadAggregateFromStream(
      randomUUID(),
      VoyageAggregate,
    );
    if (!this.voyageValidator.isNewVoyage(aggregate))
      throw new DuplicateVoyageError();

    const events = this.eventBuilderFactory
      .generateEventBuilderFromAggregate(aggregate)
      .addEventType(VoyageCreatedEvent)
      .addPayload({
        travelerId: input.travelerId,
      })
      .build();

    await this.eventClient.emitMany(events);
    return {
      voyageId: aggregate.id,
    };
  }
}
