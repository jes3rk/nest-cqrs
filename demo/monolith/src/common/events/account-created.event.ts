import { RegisterType } from "class-transformer-storage";
import { Event, IEvent } from "@nest-cqrs/core";
import { IAccount } from "../../accounting/account.interface";
import { Type } from "class-transformer";

class AccountCreatedPayload implements Pick<IAccount, "balance" | "name"> {
  balance: number;
  name: string;
}

@RegisterType()
export class AccountCreatedEvent extends Event implements IEvent {
  @Type(() => AccountCreatedPayload)
  public $payload: AccountCreatedPayload;
}
