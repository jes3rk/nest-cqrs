import { Controller } from "@nestjs/common";
import { MessageListener } from "@nest-cqrs/core";
import { VoyageCreatedEvent } from "../common/events/voyage-created.event";
import { VoyageEventService } from "./voyage.event.service";

@Controller()
export class VoyageEventController {
  constructor(private readonly eventService: VoyageEventService) {}

  @MessageListener(VoyageCreatedEvent)
  onVoyageCreatedEvent(event: VoyageCreatedEvent): Promise<void> {
    return this.eventService.handleVoyageCreated(event);
  }
}
