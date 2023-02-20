import { Event, EventConfiguration, IEvent } from "@nest-cqrs/core";
import { IsUUID } from "class-validator";
import { IVoyage } from "../interfaces/voyage.interface";
import { Type } from "class-transformer";

class VoyageCreatedEventPayload implements Pick<IVoyage, "travelerId"> {
  @IsUUID()
  public travelerId: string;
}

@EventConfiguration({})
export class VoyageCreatedEvent extends Event implements IEvent {
  public readonly $version: number = 1;
  @Type(() => VoyageCreatedEventPayload)
  public readonly $payload: VoyageCreatedEventPayload;
}
