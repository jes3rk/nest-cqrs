import { IAccount } from "../account.interface";
import { IsNotEmpty } from "class-validator";

export class CreateAccountInput implements Pick<IAccount, "name"> {
  @IsNotEmpty()
  name: string;
}
