import { IsDate, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { IHotelBooking } from "../../../common/interfaces/hotel-booking.interface";

export class Booking implements IHotelBooking {
  @IsUUID()
  roomId: string;

  @IsUUID()
  guestId: string;

  @IsDate()
  @Type(() => Date)
  checkIn: Date;

  @IsDate()
  @Type(() => Date)
  checkOut: Date;

  @IsUUID()
  hotelId: string;

  @IsUUID()
  id: string;
}
