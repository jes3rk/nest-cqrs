import { Module } from "@nestjs/common";
import { VoyageController } from "./voyage.controller";

@Module({
  controllers: [VoyageController],
})
export class VoyageModule {}
