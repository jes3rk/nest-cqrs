import { Inject, Injectable } from "@nestjs/common";
import { generateStreamID } from "../cqrs.utilites";
import {
  AggregateConstructor,
  IAggregateRoot,
} from "../interfaces/aggregate-contructor.interface";
import { EventBuilder } from "../classes/event.builder";
import { randomUUID } from "crypto";
import { AGGREGATE_METADATA, APPLICATION_NAME } from "../cqrs.constants";

type ConstructedEventBuilder = Pick<EventBuilder, "addEventType" | "build">;

@Injectable()
export class EventBuilderFactory {
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
  ) {}

  public generateEventBuilderFromComponents(
    streamName: string,
    aggregateId: string,
    correlationId?: string,
  ): ConstructedEventBuilder {
    return new EventBuilder()
      .setStreamId(
        generateStreamID(this.applicationName, aggregateId, streamName),
      )
      .setMetadata({
        $correlationId: correlationId || randomUUID(),
      });
  }

  public generateEventBuilderFromAggregate(
    aggregate: IAggregateRoot,
    correlationId?: string,
  ): ConstructedEventBuilder {
    return this.generateEventBuilderFromComponents(
      Reflect.getMetadata(AGGREGATE_METADATA, aggregate.constructor)?.name ||
        aggregate.constructor.name.replace(/([Aa]ggregate)/, ""),
      aggregate.id,
      correlationId,
    );
  }
}
