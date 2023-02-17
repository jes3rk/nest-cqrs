import { Module } from "@nestjs/common";
import { CQRSModule } from "@nest-cqrs/core";
import { VoyageController } from "./voyage.controller";
import { VoyageService } from "./voyage.service";
import { VoyageValidator } from "./voyage.validator";

@Module({
  imports: [
    CQRSModule.forFeature({
      namespace: "voyage",
    }),
  ],
  providers: [VoyageService, VoyageValidator],
  controllers: [VoyageController],
})
export class VoyageModule {}
