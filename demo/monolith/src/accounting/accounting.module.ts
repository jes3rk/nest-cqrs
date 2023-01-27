import { Module } from "@nestjs/common";
import { CQRSModule } from "@nest-cqrs/core";
import { AccountController } from "./account.controller";
import { AccountingWriteService } from "./accounting.write.service";
import { AccountingGateway } from "./accounting.gateway";
import { AccountingReadService } from "./accounting.read.service";

@Module({
  imports: [
    CQRSModule.forFeature({
      namespace: "accounting",
    }),
  ],
  providers: [AccountingWriteService, AccountingGateway, AccountingReadService],
  controllers: [AccountController],
})
export class AccountingModule {}
