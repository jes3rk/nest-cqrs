import { Injectable } from "@nestjs/common";
import { IHotelBooking } from "../../common/interfaces/hotel-booking.interface";

@Injectable()
export class BookingService {
  private readonly bookingRepository: Map<string, IHotelBooking>;

  constructor() {
    this.bookingRepository = new Map();
  }
}
