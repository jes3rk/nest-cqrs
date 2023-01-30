import { Test } from "@nestjs/testing";
import {
  AggregateFactory,
  EventClient,
  EventBuilderFactory,
  APPLICATION_NAME,
} from "@nest-cqrs/core";
import { AccountingWriteService } from "./accounting.write.service";
import { CreateAccountInput } from "./dto/create-account.input";
import { faker } from "@faker-js/faker";
import { AggregateFactoryMock, EventClientMock } from "@nest-cqrs/testing";
import { AccountCreatedEvent } from "../common/events/account-created.event";

describe("AccountingWriteService", () => {
  let service: AccountingWriteService;
  let eventClient: EventClientMock;

  const appName = faker.random.alphaNumeric(4);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountingWriteService,
        EventBuilderFactory,
        {
          provide: AggregateFactory,
          useValue: new AggregateFactoryMock(appName),
        },
        { provide: EventClient, useValue: new EventClientMock() },
        { provide: APPLICATION_NAME, useValue: appName },
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
          $metadata: {
            $correlationId: response.correlationId,
            $timestamp: expect.any(Date),
          },
          $name: AccountCreatedEvent.name,
          $payload: {
            balance: 0,
            name: input.name,
          },
          $streamId: `${appName}.account.${response.rootId}`,
        }),
      );
    });
  });
});
