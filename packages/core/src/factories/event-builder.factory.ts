import { Inject, Injectable } from "@nestjs/common";
import { generateStreamID } from "../cqrs.utilites";
import {
  AggregateConstructor,
  IAggregateRoot,
} from "../interfaces/aggregate-contructor.interface";
import { EventBuilder } from "../classes/event.builder";
import { randomUUID } from "crypto";
import { APPLICATION_NAME } from "../cqrs.constants";

type ConstructedEventBuilder = Pick<EventBuilder, "addEventType" | "build">;

@Injectable()
export class EventBuilderFactory {
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
  ) {}

  public generateEventBuilder(
    aggregate: IAggregateRoot,
    correlationId?: string,
  ): ConstructedEventBuilder {
    return new EventBuilder()
      .setStreamId(
        generateStreamID(
          this.applicationName,
          aggregate.id,
          aggregate.constructor as AggregateConstructor<any>,
        ),
      )
      .setMetadata({
        $correlationId: correlationId || randomUUID(),
      });
  }
}
