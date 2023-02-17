import { Test } from "@nestjs/testing";
import { AggregateFactory, EventBuilderFactory } from "@nest-cqrs/core";
import { AggregateFactoryMock } from "@nest-cqrs/testing";
import { VoyageService } from "./voyage.service";
import { DuplicateVoyageError } from "./exceptions/duplicate-voyage.exception";
import { VoyageValidator } from "./voyage.validator";

describe("VoyageService", () => {
  let service: VoyageService;
  let validator: VoyageValidator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VoyageService,
        VoyageValidator,
        {
          provide: AggregateFactory,
          useFactory() {
            return new AggregateFactoryMock("appName");
          },
        },
        {
          provide: EventBuilderFactory,
          useFactory() {
            return new EventBuilderFactory("appName");
          },
        },
      ],
    }).compile();

    service = module.get(VoyageService);
    validator = module.get(VoyageValidator);
  });

  it("will be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createNewVoyage", () => {
    it.todo("will create a voyage and emit a voyage created event");
    it("will throw a DuplicateVoyageError if creating a voyage with the same id", async () => {
      const newSpy = jest
        .spyOn(validator, "isNewVoyage")
        .mockReturnValue(false);
      await expect(() => service.createNewVoyage()).rejects.toThrowError(
        DuplicateVoyageError,
      );
      expect(newSpy).toHaveBeenCalled();
    });
  });
});
