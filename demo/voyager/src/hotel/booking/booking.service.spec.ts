import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookingService } from "./booking.service";
import { BookRoomForDaysInput } from "./dto/book-room-for-days.input";
import { Booking } from "./dto/booking.dto";
import { BookingEntity } from "./entities/booking.entity";
import { plainToInstance } from "class-transformer";

describe("BookingService", () => {
  let serivce: BookingService;
  let repository: Repository<BookingEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    serivce = module.get(BookingService);
    repository = module.get(getRepositoryToken(BookingEntity));
  });

  it("will be defined", () => {
    expect(serivce).toBeDefined();
  });

  describe("bookRoomForDates", () => {
    let input: BookRoomForDaysInput;
    let hotelId: string;

    beforeEach(() => {
      input = {
        checkIn: new Date(),
        checkOut: new Date(),
        guestId: faker.datatype.uuid(),
      };
      hotelId = faker.datatype.uuid();
    });

    it("will create a booking for a random room", async () => {
      const saveSpy = jest
        .spyOn(repository, "save")
        .mockImplementation(async (i) =>
          plainToInstance(BookingEntity, { ...i, id: faker.datatype.uuid() }),
        );

      const output = await serivce.bookRoomForDates({ ...input, hotelId });
      expect(output).toBeInstanceOf(Booking);
      expect(output).toMatchObject(expect.objectContaining({ ...input }));

      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
