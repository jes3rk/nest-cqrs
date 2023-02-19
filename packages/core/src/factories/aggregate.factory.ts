import { Inject, Injectable } from "@nestjs/common";
import { APPLICATION_NAME, EVENT_READER } from "../cqrs.constants";
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
  constructor(
    @Inject(APPLICATION_NAME) private readonly applicationName: string,
    @Inject(EVENT_READER) protected readonly reader: IEventReader,
  ) {}

  /**
   * Load an instance of an aggregate from the event store by applying
   * all events in the stream to the aggregate in sequence.
   *
   * @param aggregateId ID of the instance to create
   * @param aggregate Constructor of the instance
   */
  public async loadAggregateFromStream<T extends IAggregateRoot>(
    aggregateId: string,
    aggregate: AggregateConstructor<T>,
  ): Promise<T> {
    const streamID = generateStreamID(
      this.applicationName,
      aggregateId,
      aggregate,
    );
    const _agg = new aggregate(aggregateId);
    if (_agg["apply"] === undefined) throw new Error();
    await this.reader.readStreamAsynchronously(
      streamID,
      (_agg as unknown as AggregateRoot).apply.bind(_agg),
    );
    return _agg;
  }
}
