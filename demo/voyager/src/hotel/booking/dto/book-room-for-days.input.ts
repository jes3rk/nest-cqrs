import { IHotelBooking } from "../../../common/interfaces/hotel-booking.interface";
import { Type } from "class-transformer";
import { IsDate, IsUUID } from "class-validator";

export class BookRoomForDaysInput
  implements Pick<IHotelBooking, "checkIn" | "checkOut" | "guestId">
{
  @Type(() => Date)
  @IsDate()
  checkIn: Date;

  @Type(() => Date)
  @IsDate()
  checkOut: Date;

  @IsUUID()
  guestId: string;
}
