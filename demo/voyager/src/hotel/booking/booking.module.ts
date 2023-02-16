import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingEntity } from "./entities/booking.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
})
export class BookingModule {}
