import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm";
import { IVoyage, IVoyageLeg } from "../../common/interfaces/voyage.interface";
import { VoyageEntity } from "./voyage.entity";

@Entity()
export class VoyageLegEntity implements IVoyageLeg {
  @Column({ type: "date" })
  beginTime: Date;

  @Column({ type: "date" })
  endTime: Date;

  @Column({
    type: "text",
  })
  legType: "hotel";

  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  legTypeId: string;

  @ManyToOne(() => VoyageEntity)
  voyage: IVoyage;

  @Column({ type: "uuid" })
  @Index()
  @RelationId((entity: VoyageLegEntity) => entity.voyage)
  voyageId: string;
}
