import { Type } from "class-transformer";
import { Event, EventConfiguration, IEvent } from "@nest-cqrs/core";
import { ITransaction } from "../../accounting/transaction/transaction.interface";

class TransactionAppliedToAccountPayload
  implements Pick<ITransaction, "amount" | "id">
{
  amount: number;
  id: string;
}

@EventConfiguration({})
export class TransactionAppliedToAccountEvent extends Event implements IEvent {
  @Type(() => TransactionAppliedToAccountPayload)
  $payload: TransactionAppliedToAccountPayload;
  public readonly $version: number = 1;
}
