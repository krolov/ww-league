import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FactionEntity } from './faction.entity';
import { SeasonEntity } from './season.entity';

@Entity('Games')
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  oldId: string;

  @ManyToOne(() => SeasonEntity)
  season: SeasonEntity;

  @Column()
  async: boolean;

  @Column()
  deck: string;

  @Column()
  map: string;

  @Column()
  rc: boolean;

  @ManyToOne(() => FactionEntity, { nullable: true })
  undrafted: FactionEntity;

  @Column()
  discordLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
