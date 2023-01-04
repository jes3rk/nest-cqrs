import { AccountingWriteService } from "./accounting.write.service";
import { Body, Controller, Post } from "@nestjs/common";
import { CreateAccountInput } from "./dto/create-account.input";
import { OperationResponse } from "../common/operation.response";

@Controller("account")
export class AccountController {
  constructor(private readonly writeService: AccountingWriteService) {}

  @Post()
  createAccount(@Body() input: CreateAccountInput): Promise<OperationResponse> {
    return this.writeService.createAccount(input);
  }
}
