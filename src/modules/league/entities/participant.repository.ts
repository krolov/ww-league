import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ParticipantEntity } from './participant.entity';

@Injectable()
export class ParticipantRepository extends Repository<ParticipantEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ParticipantEntity, dataSource.createEntityManager());
  }
}
