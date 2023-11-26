import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactionEntity } from './entities/faction.entity';
import { FactionRepository } from './entities/faction.repository';
import { GameEntity } from './entities/game.entity';
import { GameRepository } from './entities/game.repository';
import { ParticipantEntity } from './entities/participant.entity';
import { ParticipantRepository } from './entities/participant.repository';
import { PlayerEntity } from './entities/player.entity';
import { PlayerRepository } from './entities/player.repository';
import { SeasonEntity } from './entities/season.entity';
import { SeasonRepository } from './entities/season.repository';
import { LeagueService } from './league.service';
import { PlayersService } from './players.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FactionEntity,
      GameEntity,
      ParticipantEntity,
      PlayerEntity,
      SeasonEntity,
    ]),
  ],
  providers: [
    FactionRepository,
    GameRepository,
    ParticipantRepository,
    PlayerRepository,
    SeasonRepository,
    LeagueService,
    PlayersService,
  ],
})
export class LeagueModule {}
