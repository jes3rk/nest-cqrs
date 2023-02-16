import { IHotelBooking } from "../../../common/interfaces/hotel-booking.interface";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Type } from "class-transformer";
import { HotelEntitiy } from "../../entities/hotel.entity";

@Entity()
export class BookingEntity implements IHotelBooking {
  @Column({ type: "uuid" })
  roomId: string;

  @Column({ type: "uuid" })
  guestId: string;

  @Column({ type: "timestamptz" })
  @Type(() => Date)
  checkIn: Date;

  @Column({ type: "timestamptz" })
  @Type(() => Date)
  checkOut: Date;

  @ManyToOne(() => HotelEntitiy)
  hotel: HotelEntitiy;

  @RelationId((booking: BookingEntity) => booking.hotel)
  @Column({ type: "uuid" })
  hotelId: string;

  @PrimaryGeneratedColumn("uuid")
  id: string;
}
