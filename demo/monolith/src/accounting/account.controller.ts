import { AccountingWriteService } from "./accounting.write.service";
import { Body, Controller, Param, Post } from "@nestjs/common";
import { CreateAccountInput } from "./dto/create-account.input";
import { OperationResponse } from "../common/operation.response";
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { AccountCreatedEvent } from "../common/events/account-created.event";
import { MessageListener } from "@nest-cqrs/core";
import { AccountingReadService } from "./accounting.read.service";

@Controller("account")
export class AccountController {
  constructor(
    private readonly readService: AccountingReadService,
    private readonly writeService: AccountingWriteService,
  ) {}

  @Post()
  createAccount(@Body() input: CreateAccountInput): Promise<OperationResponse> {
    return this.writeService.createAccount(input);
  }

  @Post(":accountId/transaction")
  addTransaction(
    @Param("accountId") accountId: string,
    @Body() input: CreateTransactionInput,
  ): Promise<OperationResponse> {
    return this.writeService.addTransactionToAccount(accountId, input);
  }

  @MessageListener(AccountCreatedEvent)
  handleAccountCreated(event: AccountCreatedEvent): void {
    this.readService.handleAccountCreated(event);
  }
}
