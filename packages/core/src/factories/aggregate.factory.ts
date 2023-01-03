import { Inject, Injectable } from "@nestjs/common";
import { EVENT_READER } from "../cqrs.constants";
import { IEventReader } from "../interfaces/event-reader.interface";
import { ClassConstructor } from "class-transformer";
import { generateStreamID } from "../cqrs.utilites";
import { AggregateRoot } from "../classes/aggregate.root";

@Injectable()
export class AggregateFactory {
  constructor(@Inject(EVENT_READER) private readonly reader: IEventReader) {}

  public async loadAggregateFromStream<T>(
    aggregateId: string,
    aggregate: ClassConstructor<T>,
  ): Promise<T> {
    const streamID = generateStreamID(aggregateId, aggregate);
    const _agg = new aggregate();
    if (_agg["apply"] === undefined) throw new Error();
    await this.reader.readAsynchronously(
      streamID,
      (_agg as AggregateRoot).apply.bind(_agg),
    );
    return _agg;
  }
}
