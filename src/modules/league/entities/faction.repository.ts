import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FactionEntity } from './faction.entity';

@Injectable()
export class FactionRepository extends Repository<FactionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FactionEntity, dataSource.createEntityManager());
  }

  findFactionByName(name: string) {
    return this.findOne({ where: { name } });
  }
}
