import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingService } from "./booking.service";
import { BookingEntity } from "./entities/booking.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
