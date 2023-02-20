import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { IVoyage, IVoyageLeg } from "../../common/interfaces/voyage.interface";
import { VoyageLegEntity } from "./voyage-leg.entitiy";

@Entity()
export class VoyageEntity implements IVoyage {
  @Column({ type: "timestamptz" })
  createdAt: Date;

  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  travelerId: string;

  @OneToMany(() => VoyageLegEntity, (entity) => entity.voyage)
  legs: IVoyageLeg[];
}
