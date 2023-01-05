import { Aggregate, Apply } from "@nest-cqrs/core";
import { randomUUID } from "crypto";
import { AccountCreatedEvent } from "../../common/events/account-created.event";
import { TransactionAppliedToAccountEvent } from "../../common/events/transaction-applied-to-account.event";
import { IAccount } from "../account.interface";
import { CreateAccountInput } from "../dto/create-account.input";
import { CreateTransactionInput } from "../dto/create-transaction.input";
import { ITransaction } from "../transaction/transaction.interface";

@Aggregate()
export class AccountAggregate implements IAccount {
  createdAt: Date;
  balance: number;
  name: string;
  transactions: ITransaction[];

  public get updatedAt(): Date {
    return this["$updatedAt"];
  }

  constructor(public readonly id: string) {}

  @Apply(AccountCreatedEvent)
  handleAccountCreated(event: AccountCreatedEvent): void {
    this.balance = event.$payload.balance;
    this.createdAt = event.$metadata.$timestamp;
    this.name = event.$payload.name;
    this.transactions = [];
  }

  public createAccountPayload(
    input: CreateAccountInput,
  ): AccountCreatedEvent["$payload"] {
    return {
      balance: 0,
      name: input.name,
    };
  }

  @Apply(TransactionAppliedToAccountEvent)
  handleTransactionAppliedToAccount(
    event: TransactionAppliedToAccountEvent,
  ): void {
    this.balance = this.balance + event.$payload.amount;
    this.transactions.push({
      ...event.$payload,
      timestamp: event.$metadata.$timestamp,
    });
  }

  public createTransactionAppliedToAccountPayload(
    input: CreateTransactionInput,
  ): TransactionAppliedToAccountEvent["$payload"] {
    return {
      amount: input.amount,
      id: randomUUID(),
    };
  }
}
