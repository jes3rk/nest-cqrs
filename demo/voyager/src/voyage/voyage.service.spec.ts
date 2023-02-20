import { Test } from "@nestjs/testing";
import {
  AggregateFactory,
  EventBuilderFactory,
  EventClient,
} from "@nest-cqrs/core";
import { AggregateFactoryMock, EventClientMock } from "@nest-cqrs/testing";
import { VoyageService } from "./voyage.service";
import { DuplicateVoyageError } from "./exceptions/duplicate-voyage.exception";
import { VoyageValidator } from "./voyage.validator";
import { CreateVoyageInput } from "./dto/create-voyage.input";
import { faker } from "@faker-js/faker";
import { VoyageCreatedEvent } from "../common/events/voyage-created.event";

describe("VoyageService", () => {
  let client: EventClient;
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
        {
          provide: EventClient,
          useClass: EventClientMock,
        },
      ],
    }).compile();

    client = module.get(EventClient);
    service = module.get(VoyageService);
    validator = module.get(VoyageValidator);
  });

  it("will be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createNewVoyage", () => {
    let input: CreateVoyageInput;

    beforeEach(() => {
      input = {
        travelerId: faker.datatype.uuid(),
      };
    });

    it("will create a voyage and emit a voyage created event", async () => {
      const emitManySpy = jest.spyOn(client, "emitMany");
      await service.createNewVoyage(input);
      expect(emitManySpy).toHaveBeenCalledWith([
        expect.objectContaining({
          $name: VoyageCreatedEvent.name,
          $payload: {
            travelerId: input.travelerId,
          },
        }),
      ]);
    });

    it("will throw a DuplicateVoyageError if creating a voyage with the same id", async () => {
      const newSpy = jest
        .spyOn(validator, "isNewVoyage")
        .mockReturnValue(false);
      await expect(() => service.createNewVoyage(input)).rejects.toThrowError(
        DuplicateVoyageError,
      );
      expect(newSpy).toHaveBeenCalled();
    });
  });
});
