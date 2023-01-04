import { Inject, Injectable } from "@nestjs/common";
import { EVENT_READER } from "../cqrs.constants";
import { IEventReader } from "../interfaces/event-reader.interface";
import { ClassConstructor } from "class-transformer";
import { generateStreamID } from "../cqrs.utilites";
import { AggregateRoot } from "../classes/aggregate.root";
import {
  AggregateConstructor,
  IAggregateRoot,
} from "../interfaces/aggregate-contructor.interface";

@Injectable()
export class AggregateFactory {
  constructor(@Inject(EVENT_READER) protected readonly reader: IEventReader) {}

  public async loadAggregateFromStream<T extends IAggregateRoot>(
    aggregateId: string,
    aggregate: AggregateConstructor<T>,
  ): Promise<T> {
    const streamID = generateStreamID(aggregateId, aggregate);
    const _agg = new aggregate(aggregateId);
    if (_agg["apply"] === undefined) throw new Error();
    await this.reader.readStreamAsynchronously(
      streamID,
      (_agg as unknown as AggregateRoot).apply.bind(_agg),
    );
    return _agg;
  }
}
