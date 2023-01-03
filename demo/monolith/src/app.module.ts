import { Module } from "@nestjs/common";
import { MessengerModule } from "nest-messenger";
import { AccountingModule } from "./accounting/accounting.module";
import { AppController } from "./app.controller";

@Module({
  imports: [MessengerModule, AccountingModule],
  controllers: [AppController],
})
export class AppModule {}
