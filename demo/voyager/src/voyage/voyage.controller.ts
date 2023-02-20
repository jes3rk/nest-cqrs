import { Body, Controller, Post } from "@nestjs/common";
import { CreateVoyageInput } from "./dto/create-voyage.input";
import { VoyageService } from "./voyage.service";

@Controller("voyage")
export class VoyageController {
  constructor(private readonly serivce: VoyageService) {}

  @Post()
  createNewVoyage(
    @Body() input: CreateVoyageInput,
  ): Promise<{ voyageId: string }> {
    return this.serivce.createNewVoyage(input);
  }
}
