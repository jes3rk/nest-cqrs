import { Test } from "@nestjs/testing";
import {
  AggregateFactory,
  EventClient,
  EventBuilderFactory,
} from "@nest-cqrs/core";
import { AccountingWriteService } from "./accounting.write.service";
import { CreateAccountInput } from "./dto/create-account.input";
import { faker } from "@faker-js/faker";
import { AggregateFactoryMock, EventClientMock } from "@nest-cqrs/testing";
import { AccountCreatedEvent } from "../common/events/account-created.event";

describe("AccountingWriteService", () => {
  let service: AccountingWriteService;
  let eventClient: EventClientMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountingWriteService,
        EventBuilderFactory,
        { provide: AggregateFactory, useValue: new AggregateFactoryMock() },
        { provide: EventClient, useValue: new EventClientMock() },
      ],
    }).compile();

    service = module.get(AccountingWriteService);
    eventClient = module.get(EventClient);
  });

  it("will be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createAccount", () => {
    let input: CreateAccountInput;

    beforeEach(() => {
      input = new CreateAccountInput();
      input.name = faker.random.word();
    });

    it("will create a new account and return a response object", async () => {
      const input: CreateAccountInput = {
        name: faker.random.word(),
      };

      const response = await service.createAccount(input);
      expect(response).toHaveProperty("correlationId");
      expect(response).toHaveProperty("rootId");

      expect(eventClient.emitMany).toHaveBeenCalledTimes(1);
      expect(eventClient.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          $correlationId: response.correlationId,
          $name: AccountCreatedEvent.name,
          $payload: {
            balance: 0,
            name: input.name,
          },
          $streamID: `account.${response.rootId}`,
        }),
      );
    });
  });
});
