import { isUUID } from "class-validator";
import { AccountAggregate } from "../aggregates/account.aggregate";

export class AccountValidator {
  constructor(private readonly account: AccountAggregate) {}

  public isAccountFound(): boolean {
    return !!this.account.createdAt;
  }

  public static isValidAccountId(id: any): boolean {
    return isUUID(id);
  }
}
