import { Controller, Get, Query } from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('league')
export class LeagueController {
  constructor(private readonly service: LeagueService) {}

  @Get('factions')
  async getFactions(
    @Query('season') season?: number,
    @Query('map') map?: string,
    @Query('turnOrder') turnOrder?: number,
  ) {
    return await this.service.getFactionsRate({ season, map, turnOrder });
  }

  @Get('leaderboard')
  async getLeaderboard(
    @Query('season') season?: number,
    @Query('map') map?: string,
    @Query('turnOrder') turnOrder?: number,
  ) {
    return await this.service.getLeaderboard({ season, map, turnOrder });
  }

  @Get('player')
  async getPlayerStats(
    @Query('player') playerId: string,
    @Query('season') season?: number,
    @Query('map') map?: string,
    @Query('turnOrder') turnOrder?: number,
  ) {
    return await this.service.getPlayerStats(playerId, {
      season,
      map,
      turnOrder,
    });
  }
}
