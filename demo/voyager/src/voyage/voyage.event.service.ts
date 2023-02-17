import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { parseStreamID } from "packages/core/dist";
import { Repository } from "typeorm";
import { VoyageCreatedEvent } from "../common/events/voyage-created.event";
import { VoyageEntity } from "./entities/voyage.entity";

@Injectable()
export class VoyageEventService {
  constructor(
    @InjectRepository(VoyageEntity)
    private readonly voyageRepository: Repository<VoyageEntity>,
  ) {}

  public async handleVoyageCreated(event: VoyageCreatedEvent): Promise<void> {
    await this.voyageRepository.save({
      createdAt: event.$metadata.$timestamp,
      id: parseStreamID(event.$streamId).id,
      ...event.$payload,
    });
  }
}
