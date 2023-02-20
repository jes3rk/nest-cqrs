import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { VoyageAggregate } from "./voyage.aggregate";
import { VoyageValidator } from "./voyage.validator";

describe("VoyageValidator", () => {
  let validator: VoyageValidator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VoyageValidator],
    }).compile();

    validator = module.get(VoyageValidator);
  });

  it("will be defined", () => {
    expect(validator).toBeDefined();
  });

  describe("isNewVoyage", () => {
    it("will return true if the createdAt date is not set", () => {
      const agg = new VoyageAggregate(faker.datatype.uuid());
      expect(validator.isNewVoyage(agg)).toEqual(true);
    });

    it("will return false if the createdAt date is set", () => {
      const agg = new VoyageAggregate(faker.datatype.uuid());
      agg.createdAt = new Date();

      expect(validator.isNewVoyage(agg)).toEqual(false);
    });
  });
});
