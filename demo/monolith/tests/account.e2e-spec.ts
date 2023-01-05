import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { CreateAccountInput } from "../src/accounting/dto/create-account.input";
import { faker } from "@faker-js/faker";

describe("Account", () => {
  let app: INestApplication;
  let server: typeof request;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
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
        .set("x-cqrs-client-id", "12345")
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("rootId");
          expect(body).toHaveProperty("correlationId");
        });
    });
  });
});
