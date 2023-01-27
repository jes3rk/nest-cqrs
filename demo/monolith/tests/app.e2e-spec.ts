import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { WsAdapter } from "@nestjs/platform-ws";

describe("App", () => {
  let app: INestApplication;
  let server: typeof request;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("will respond with 200", async () => {
    await request(server)
      .get("/hello")
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual("world");
      });
  });
});
