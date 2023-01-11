import { Module } from "@nestjs/common";
import { CQRSModule } from "@nest-cqrs/core";
import { AccountController } from "./account.controller";
import { AccountingWriteService } from "./accounting.write.service";

@Module({
  imports: [
    CQRSModule.forFeature({
      namespace: "accounting",
    }),
  ],
  providers: [AccountingWriteService],
  controllers: [AccountController],
})
export class AccountingModule {}
