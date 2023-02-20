import { IsUUID } from "class-validator";
import { IVoyage } from "../../common/interfaces/voyage.interface";

export class CreateVoyageInput implements Pick<IVoyage, "travelerId"> {
  @IsUUID()
  public readonly travelerId: string;
}
