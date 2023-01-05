import { IsNumber } from "class-validator";
import { ITransaction } from "../transaction/transaction.interface";

export class CreateTransactionInput implements Pick<ITransaction, "amount"> {
  @IsNumber()
  amount: number;
}
