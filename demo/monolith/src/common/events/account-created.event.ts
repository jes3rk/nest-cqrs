import { Event, EventConfiguration, IEvent } from "@nest-cqrs/core";
import { IAccount } from "../../accounting/account.interface";
import { Type } from "class-transformer";

class AccountCreatedPayload implements Pick<IAccount, "balance" | "name"> {
  balance: number;
  name: string;
}

@EventConfiguration({})
export class AccountCreatedEvent extends Event implements IEvent {
  @Type(() => AccountCreatedPayload)
  public $payload: AccountCreatedPayload;
  public readonly $version: number = 1;
}
