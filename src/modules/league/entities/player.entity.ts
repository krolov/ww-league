import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Other {
  email?: string;
  leagueAmount?: string;
}

@Entity('Players')
export class PlayerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  discordId: string;

  @Column({ nullable: true })
  rootId: string;

  @Column({ type: 'jsonb', default: {} })
  other: Other;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
