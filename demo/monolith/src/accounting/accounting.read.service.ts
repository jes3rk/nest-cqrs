import { Injectable } from "@nestjs/common";
import { AccountCreatedEvent } from "../common/events/account-created.event";
import { IAccount } from "./account.interface";

@Injectable()
export class AccountingReadService {
  private repository: Map<IAccount["id"], IAccount>;

  constructor() {
    this.repository = new Map();
  }

  public handleAccountCreated(event: AccountCreatedEvent): void {
    const accountId = event.$streamId.split(".").at(-1);
    this.repository.set(accountId, {
      id: accountId,
      ...event.$payload,
      createdAt: event.$metadata.$timestamp,
      updatedAt: event.$metadata.$timestamp,
      transactions: [],
    });
  }

  public findAccountById(id: string): IAccount {
    return this.repository.get(id);
  }
}
