import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SeasonEntity } from './season.entity';

@Injectable()
export class SeasonRepository extends Repository<SeasonEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SeasonEntity, dataSource.createEntityManager());
  }

  getCurrentSeason() {
    return this.findOne({ where: { isCurrent: true } });
  }

  getSeasonByNumber(id: number) {
    return this.findOne({ where: { id } });
  }
}
