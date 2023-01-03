import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from "supertest";

describe("App", () => {
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

  it("will respond with 200", async () => {
    await request(server)
      .get("/hello")
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual("world");
      });
  });
});
