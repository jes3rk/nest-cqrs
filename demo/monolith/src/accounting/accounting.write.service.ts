import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AggregateFactory,
  EventClient,
  EventBuilderFactory,
} from "@nest-cqrs/core";
import { AccountValidator } from "./validators/account.validator";
import { OperationResponse } from "../common/operation.response";
import { CreateAccountInput } from "./dto/create-account.input";
import { AccountAggregate } from "./aggregates/account.aggregate";
import { AccountCreatedEvent } from "../common/events/account-created.event";
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { TransactionAppliedToAccountEvent } from "../common/events/transaction-applied-to-account.event";

@Injectable()
export class AccountingWriteService {
  constructor(
    private readonly aggregateFactory: AggregateFactory,
    private readonly eventFactory: EventBuilderFactory,
    private readonly eventClient: EventClient,
  ) {}

  public async createAccount(
    input: CreateAccountInput,
  ): Promise<OperationResponse> {
    const response: OperationResponse = {
      rootId: randomUUID(),
      correlationId: randomUUID(),
    };

    const aggregate = await this.aggregateFactory.loadAggregateFromStream(
      response.rootId,
      AccountAggregate,
    );

    const eventBuilder = this.eventFactory.generateEventBuilder(
      aggregate,
      response.correlationId,
    );

    const events = eventBuilder
      .addEventType(AccountCreatedEvent)
      .addPayload(aggregate.createAccountPayload(input))
      .build();

    await this.eventClient.emitMany(events);
    return response;
  }

  public async addTransactionToAccount(
    accountId: string,
    transaction: CreateTransactionInput,
  ): Promise<OperationResponse> {
    if (!AccountValidator.isValidAccountId(accountId))
      throw new BadRequestException();

    const response: OperationResponse = {
      rootId: accountId,
      correlationId: randomUUID(),
    };

    const aggregate = await this.aggregateFactory.loadAggregateFromStream(
      accountId,
      AccountAggregate,
    );

    if (!new AccountValidator(aggregate).isAccountFound())
      throw new NotFoundException();

    const events = this.eventFactory
      .generateEventBuilder(aggregate, response.correlationId)
      .addEventType(TransactionAppliedToAccountEvent)
      .addPayload(
        aggregate.createTransactionAppliedToAccountPayload(transaction),
      )
      .build();

    await this.eventClient.emitMany(events);
    return response;
  }
}
