import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingModule } from "./booking/booking.module";
import { HotelEntitiy } from "./entities/hotel.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HotelEntitiy]), BookingModule],
})
export class HotelModule {}
