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
import { GameEntity } from './game.entity';
import { PlayerEntity } from './player.entity';

@Entity('Participants')
export class ParticipantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GameEntity)
  game: GameEntity;

  @ManyToOne(() => PlayerEntity, { eager: true })
  player: PlayerEntity;

  @ManyToOne(() => FactionEntity)
  faction: FactionEntity;

  @Column({ nullable: true })
  score: number;

  @Column({ default: false })
  dominationCoalition: boolean;

  @Column({ nullable: true })
  dominationCoalitionType: string;

  @Column({ type: 'decimal' })
  leagueScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
