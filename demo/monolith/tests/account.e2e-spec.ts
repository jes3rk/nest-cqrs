import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { CreateAccountInput } from "../src/accounting/dto/create-account.input";
import { faker } from "@faker-js/faker";
import { CreateTransactionInput } from "../src/accounting/dto/create-transaction.input";
import { WsClient } from "./utilities/ws.client";
import { AccountCreatedEvent } from "../src/common/events/account-created.event";
import { WsAdapter } from "@nestjs/platform-ws";
import { TransactionAppliedToAccountEvent } from "../src/common/events/transaction-applied-to-account.event";

describe("Account", () => {
  let app: INestApplication;
  let clientId: string;
  let server: typeof request;
  let wsClient: WsClient;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
    server = app.getHttpServer();
    clientId = faker.random.alphaNumeric(6);

    wsClient = await WsClient.fromApplication(app);
    wsClient.sendMessage({
      event: "account/by_client_id",
      data: { clientId },
    });
  });

  afterAll(async () => {
    wsClient.close();
    await app.close();
  });

  describe("createAccount", () => {
    let input: CreateAccountInput;

    beforeEach(() => {
      input = {
        name: faker.random.word(),
      };
    });

    it("will create a new account and emit an account created event", async () => {
      await request(server)
        .post("/account")
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("rootId");
          expect(body).toHaveProperty("correlationId");
        });

      const event = await wsClient.listenForEvent<AccountCreatedEvent>(
        (e) => e.$name === AccountCreatedEvent.name,
      );
      expect(event.$payload.name).toEqual(input.name);
      expect(event.$payload.balance).toEqual(0);
    });
  });

  describe("addTransactionToAccount", () => {
    let input: CreateTransactionInput;

    beforeEach(async () => {
      input = {
        amount: 10,
      };
    });

    it("will apply the transaction correctly and emit a transaction applied event", async () => {
      const res = await request(server)
        .post("/account")
        .set("x-cqrs-client-id", clientId)
        .send({
          name: faker.random.word(),
        })
        .expect(201);

      const accountId = res.body.rootId;

      await request(server)
        .post(`/account/${accountId}/transaction`)
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("rootId", accountId);
        });

      const event =
        await wsClient.listenForEvent<TransactionAppliedToAccountEvent>(
          (e) =>
            e.$name === TransactionAppliedToAccountEvent.name &&
            e.$streamId.includes(accountId),
        );
      expect(event.$payload.amount).toEqual(input.amount);
      await request(server)
        .post(`/account/${accountId}/transaction`)
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("rootId", accountId);
        });
    });

    it("will throw a 400 if accountId isn't a uuid", () => {
      return request(server)
        .post(`/account/hello/transaction`)
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(400);
    });

    it("will throw a 404 if the accountId doesn't exist", () => {
      return request(server)
        .post(`/account/hello/transaction`)
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(400);
    });
  });
});
