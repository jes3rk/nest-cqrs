import { AccountAggregate } from "./account.aggregate";
import { faker } from "@faker-js/faker";

describe("AccountAggregate", () => {
  let aggregate: AccountAggregate;

  beforeEach(() => {
    aggregate = new AccountAggregate(faker.datatype.uuid());
  });
});
