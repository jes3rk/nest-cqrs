import { Injectable } from "@nestjs/common";
import { AggregateRoot } from "../classes/aggregate.root";
import { IEvent } from "../interfaces/event.interface";
import { ClassConstructor } from "class-transformer";
import { generateStreamID } from "../cqrs.utilites";
import {
  AggregateConstructor,
  IAggregateRoot,
} from "../interfaces/aggregate-contructor.interface";
import { EventBuilder } from "../classes/event.builder";

type ConstructedEventBuilder = Pick<EventBuilder, "addEventType" | "build">;

@Injectable()
export class EventFactory {
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
      .setCorrelationId(correlationId);
  }
}
