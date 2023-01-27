import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useWebSocketAdapter(new WsAdapter());

  await app.listen(3000);
  console.log("App listening on port 3000");
}

bootstrap();
