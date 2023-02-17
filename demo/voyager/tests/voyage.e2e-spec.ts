import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { WsClient } from "./utilities/ws.client";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { WsAdapter } from "@nestjs/platform-ws";
import { faker } from "@faker-js/faker";

describe("Voyage", () => {
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
      event: "voyage/by_client_id",
      data: { clientId },
    });
  });

  afterAll(async () => {
    wsClient.close();
    await app.close();
  });

  // this block of tests is designed to be run synchronously
  describe("planning a voyage", () => {
    it("will create a new voyage for planning", () => {
      const travelerId = faker.datatype.uuid();
      return request(server)
        .post("/voyage")
        .set("x-cqrs-client-id", clientId)
        .send({ travelerId })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("voyageId");
        });
    });

    it.todo("will create a new hotel booking linked to the voyage");
  });
});
