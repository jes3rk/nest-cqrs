import { Module } from "@nestjs/common";
import { AccountingWriteService } from "./accounting.write.service";

@Module({
  providers: [AccountingWriteService],
})
export class AccountingModule {}
