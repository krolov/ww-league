import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameEntity } from './game.entity';

@Injectable()
export class GameRepository extends Repository<GameEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(GameEntity, dataSource.createEntityManager());
  }

  findgameByOldId(oldId: string) {
    return this.findOne({ where: { oldId } });
  }
}
