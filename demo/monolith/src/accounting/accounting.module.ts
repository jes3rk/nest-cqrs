import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountingWriteService } from "./accounting.write.service";

@Module({
  providers: [AccountingWriteService],
  controllers: [AccountController],
})
export class AccountingModule {}
