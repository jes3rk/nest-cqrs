import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { CreateAccountInput } from "../src/accounting/dto/create-account.input";
import { faker } from "@faker-js/faker";
import { CreateTransactionInput } from "../src/accounting/dto/create-transaction.input";

describe("Account", () => {
  let app: INestApplication;
  let clientId: string;
  let server: typeof request;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    clientId = faker.random.alphaNumeric(6);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("createAccount", () => {
    let input: CreateAccountInput;

    beforeEach(() => {
      input = {
        name: faker.random.word(),
      };
    });

    it("will create a new account", () => {
      return request(server)
        .post("/account")
        .set("x-cqrs-client-id", clientId)
        .send(input)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("rootId");
          expect(body).toHaveProperty("correlationId");
        });
    });
  });

  describe("addTransactionToAccount", () => {
    let input: CreateTransactionInput;

    beforeEach(async () => {
      input = {
        amount: 10,
      };
    });

    it("will apply the transaction correctly", async () => {
      const res = await request(server)
        .post("/account")
        .set("x-cqrs-client-id", clientId)
        .send({
          name: faker.random.word(),
        })
        .expect(201);

      const accountId = res.body.rootId;

      return request(server)
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
