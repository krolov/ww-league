import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';

@Injectable()
export class PlayerRepository extends Repository<PlayerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PlayerEntity, dataSource.createEntityManager());
  }

  findByRootId(rootId: string) {
    return this.findOne({ where: { rootId } });
  }
}
