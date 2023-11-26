import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { FilterSettings } from '../league.dto';
import { ParticipantEntity } from './participant.entity';

const addConditions = (
  query: SelectQueryBuilder<ParticipantEntity>,
  { season, map, turnOrder }: FilterSettings,
) => {
  if (season !== undefined) {
    query = query.andWhere('game.season = :season', { season });
  }
  if (map !== undefined) {
    query = query.andWhere('game.map = :map', { map });
  }
  if (turnOrder !== undefined) {
    query = query.andWhere('participant.turnOrder = :turnOrder', {
      turnOrder,
    });
  }
  return query;
};

@Injectable()
export class ParticipantRepository extends Repository<ParticipantEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ParticipantEntity, dataSource.createEntityManager());
  }

  async findFactionsBySettings(settings: FilterSettings): Promise<
    {
      name: string;
      vagabond: boolean;
      winRate: string;
      games: string;
      points: string;
    }[]
  > {
    const query = this.createQueryBuilder('participant')
      .innerJoin('Games', 'game', 'game.id = participant.gameId')
      .innerJoin('Factions', 'faction', 'faction.id = participant.factionId')
      .select('faction.name', 'name')
      .addSelect('faction.vagabond', 'vagabond')
      .addSelect('sum("leagueScore")/count("leagueScore")', 'winRate')
      .addSelect('count("leagueScore")', 'games')
      .addSelect('sum("leagueScore")', 'points')
      .groupBy('faction.id');

    return await addConditions(query, settings).getRawMany();
  }

  async findParticipantsBySettings(
    minGames: number,
    settings: FilterSettings,
  ): Promise<
    {
      name: string;
      id: string;
      winRate: string;
      games: string;
      points: string;
    }[]
  > {
    const query = this.createQueryBuilder('participant')
      .innerJoin('Games', 'game', 'game.id = participant.gameId')
      .innerJoin('Players', 'player', 'player.id = participant.playerId')
      .select('player.id', 'id')
      .addSelect('player."rootId"', 'name')
      .addSelect('sum("leagueScore")/count("leagueScore")', 'winRate')
      .addSelect('count("leagueScore")', 'games')
      .addSelect('sum("leagueScore")', 'points')
      .groupBy('player.id')
      .having('count("leagueScore") >= :minGames', {
        minGames,
      });

    return await addConditions(query, settings).getRawMany();
  }

  async findPlayerStatsBySettings(playerId: string, settings: FilterSettings) {
    const query = this.createQueryBuilder('participant')
      .innerJoin('Games', 'game', 'game.id = participant.gameId')
      .innerJoin('Factions', 'faction', 'faction.id = participant.factionId')
      .select('faction.name', 'name')
      .addSelect('faction.vagabond', 'vagabond')
      .addSelect('sum("leagueScore")/count("leagueScore")', 'winRate')
      .addSelect('count("leagueScore")', 'games')
      .addSelect('sum("leagueScore")', 'points')
      .groupBy('faction.id')
      .where('"playerId" = :playerId', { playerId });

    return await addConditions(query, settings).getRawMany();
  }
}
