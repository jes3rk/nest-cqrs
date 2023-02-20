import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { IHotelBooking } from "../../common/interfaces/hotel-booking.interface";
import { BookRoomForDaysInput } from "./dto/book-room-for-days.input";
import { Booking } from "./dto/booking.dto";
import { BookingEntity } from "./entities/booking.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  public async bookRoomForDates(
    input: BookRoomForDaysInput & { hotelId: string },
  ): Promise<Booking> {
    const entitiy = await this.bookingRepository.save({
      ...input,
      roomId: randomUUID(),
    });

    return plainToInstance(Booking, entitiy);
  }
}
