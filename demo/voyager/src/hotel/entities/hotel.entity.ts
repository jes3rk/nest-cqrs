import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HotelEntitiy {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
