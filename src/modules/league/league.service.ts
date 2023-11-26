import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { rate } from 'openskill';
import { formatInt, formatPercent, toBN } from '../../utils/math';
import { FactionRepository } from './entities/faction.repository';
import { GameRepository } from './entities/game.repository';
import { ParticipantRepository } from './entities/participant.repository';
import { SeasonRepository } from './entities/season.repository';
import { FilterSettings } from './league.dto';
import { PlayersService } from './players.service';

@Injectable()
export class LeagueService {
  constructor(
    private readonly gamesRepository: GameRepository,
    private readonly factionsRepository: FactionRepository,
    private readonly participantsRepository: ParticipantRepository,
    private readonly seasonRepository: SeasonRepository,

    private readonly playersService: PlayersService,
  ) {}

  async getFactionsRate(settings: FilterSettings) {
    const result =
      await this.participantsRepository.findFactionsBySettings(settings);
    return this.prepareFactionStats(result);
  }

  async getPlayerStats(playerId: string, settings: FilterSettings) {
    const result = await this.participantsRepository.findPlayerStatsBySettings(
      playerId,
      settings,
    );
    return this.prepareFactionStats(result);
  }

  prepareFactionStats(
    factions: {
      name: string;
      vagabond: boolean;
      winRate: string;
      games: string;
      points: string;
    }[],
  ) {
    factions.push(
      factions
        .filter((item) => item.vagabond)
        .reduce(
          (acc, curr) => {
            return {
              name: 'Vagabond',
              vagabond: true,
              winRate: toBN(acc.winRate)
                .times(acc.games)
                .plus(toBN(curr.winRate).times(curr.games))
                .div(parseInt(acc.games) + parseInt(curr.games))
                .toString(),
              games: (parseInt(acc.games) + parseInt(curr.games)).toString(),
              points: (parseInt(acc.points) + parseInt(curr.points)).toString(),
            };
          },
          {
            name: 'Vagabond',
            vagabond: true,
            winRate: '0',
            games: '0',
            points: '0',
          },
        ),
    );
    return factions.map((item) => this.prepareFactionStatRow(item));
  }

  prepareFactionStatRow(faction: {
    name: string;
    vagabond: boolean;
    winRate: string;
    games: string;
    points: string;
  }) {
    return {
      name: faction.name,
      winRate: formatPercent(faction.winRate),
      games: formatInt(faction.games),
      points: faction.points,
    };
  }

  async getLeaderboard(settings: FilterSettings) {
    const minGames = settings.map || settings.turnOrder ? 1 : 15;
    const result = await this.participantsRepository.findParticipantsBySettings(
      minGames,
      settings,
    );
    return result.map((item) => this.prepareLeaderboard(item));
  }

  prepareLeaderboard(leaderBoard: {
    id: string;
    name: string;
    winRate: string;
    games: string;
  }) {
    return {
      ...leaderBoard,
      winRate: formatPercent(leaderBoard.winRate),
      games: formatInt(leaderBoard.games),
    };
  }

  async ratePlayers() {
    const games = await this.gamesRepository.find({
      where: { season: { id: 3 } },
      order: { createdAt: 'ASC' },
    });
    for (const game of games) {
      const participants = await this.participantsRepository.find({
        where: { game: { id: game.id } },
      });
      const ratingsBefore = participants
        .map((p) => this.playersService.getPlayerRating(p.player))
        .map((r) => [r]);

      const ratingsAfter = rate(ratingsBefore, {
        rank: participants.map((p) => (+p.leagueScore > 0 ? 1 : 2)),
      });

      participants.forEach((p, i) => {
        // console.log(ratingsAfter[i][0]);
        this.playersService.updatePlayerRating(p.player, ratingsAfter[i][0]);
      });
    }
    this.playersService.prepareRating();
  }

  async parseFile() {
    const file = readFileSync('./allData.csv');
    const data = file
      .toString()
      .split('\n')
      .map((line) => line.split(','))
      .slice(1);

    for (const line of data) {
      await this.parseLine(line);
    }
  }

  async parseLine(line: string[]) {
    const [
      id,
      date,
      player1,
      player2,
      player3,
      player4,
      faction1,
      faction2,
      faction3,
      faction4,
      undraftedString,
      score1,
      score2,
      score3,
      score4,
      leagueScore1,
      leagueScore2,
      leagueScore3,
      leagueScore4,
      map,
      deck,
      rc,
      live,
      link,
      seasonString,
      domination1,
      domination2,
      domination3,
      domination4,
    ] = line;

    const season = await this.seasonRepository.getSeasonByNumber(
      +seasonString.replace('A', ''),
    );

    const undrafted =
      await this.factionsRepository.findFactionByName(undraftedString);

    if (await this.gamesRepository.findgameByOldId(id)) return;

    const game = this.gamesRepository.create({
      oldId: id,
      season,
      async: live === 'Async',
      deck,
      map,
      rc: rc === 'Random',
      undrafted,
      discordLink: link,
      createdAt: new Date(date),
    });

    await game.save();

    const participantData = [
      {
        player: player1,
        faction: faction1,
        score: score1,
        leagueScore: leagueScore1,
        domination: domination1,
        turnOrder: 1,
      },
      {
        player: player2,
        faction: faction2,
        score: score2,
        leagueScore: leagueScore2,
        domination: domination2,
        turnOrder: 2,
      },
      {
        player: player3,
        faction: faction3,
        score: score3,
        leagueScore: leagueScore3,
        domination: domination3,
        turnOrder: 3,
      },
      {
        player: player4,
        faction: faction4,
        score: score4,
        leagueScore: leagueScore4,
        domination: domination4,
        turnOrder: 4,
      },
    ];

    await Promise.all(
      participantData.map(async (participant) => {
        // TODO: domination logic
        const player = await this.playersService.getOrCreatePlayer(
          participant.player,
        );
        const faction = await this.factionsRepository.findFactionByName(
          participant.faction,
        );
        const score = parseFloat(participant.score);
        return this.participantsRepository
          .create({
            game,
            player,
            faction,
            score: isNaN(score) ? null : score,
            leagueScore: +participant.leagueScore,
            turnOrder: participant.turnOrder,
          })
          .save();
      }),
    );
  }
}
