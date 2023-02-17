import { Module } from "@nestjs/common";
import { CQRSModule } from "@nest-cqrs/core";
import { VoyageController } from "./voyage.controller";
import { VoyageService } from "./voyage.service";
import { VoyageValidator } from "./voyage.validator";
import { VoyageEventController } from "./voyage.event.controller";
import { VoyageGateway } from "./voyage.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoyageEntity } from "./entities/voyage.entity";
import { VoyageLegEntity } from "./entities/voyage-leg.entitiy";
import { VoyageEventService } from "./voyage.event.service";

@Module({
  imports: [
    CQRSModule.forFeature({
      namespace: "voyage",
    }),
    TypeOrmModule.forFeature([VoyageEntity, VoyageLegEntity]),
  ],
  providers: [
    VoyageEventService,
    VoyageGateway,
    VoyageService,
    VoyageValidator,
  ],
  controllers: [VoyageController, VoyageEventController],
})
export class VoyageModule {}
