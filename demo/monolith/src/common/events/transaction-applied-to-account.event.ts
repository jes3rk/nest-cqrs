import { Type } from "class-transformer";
import { RegisterType } from "class-transformer-storage";
import { Event, IEvent } from "@nest-cqrs/core";
import { ITransaction } from "../../accounting/transaction/transaction.interface";

class TransactionAppliedToAccountPayload
  implements Pick<ITransaction, "amount" | "id">
{
  amount: number;
  id: string;
}

@RegisterType()
export class TransactionAppliedToAccountEvent extends Event implements IEvent {
  @Type(() => TransactionAppliedToAccountPayload)
  $payload: TransactionAppliedToAccountPayload;
}
