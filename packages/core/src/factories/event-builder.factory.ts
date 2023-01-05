import { Injectable } from "@nestjs/common";
import { generateStreamID } from "../cqrs.utilites";
import {
  AggregateConstructor,
  IAggregateRoot,
} from "../interfaces/aggregate-contructor.interface";
import { EventBuilder } from "../classes/event.builder";
import { randomUUID } from "crypto";

type ConstructedEventBuilder = Pick<EventBuilder, "addEventType" | "build">;

@Injectable()
export class EventBuilderFactory {
  public generateEventBuilder(
    aggregate: IAggregateRoot,
    correlationId?: string,
  ): ConstructedEventBuilder {
    return new EventBuilder()
      .setStreamId(
        generateStreamID(
          aggregate.id,
          aggregate.constructor as AggregateConstructor<any>,
        ),
      )
      .setMetadata({
        $correlationId: correlationId || randomUUID(),
      });
  }
}
