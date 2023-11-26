import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { FactionRepository } from './entities/faction.repository';
import { GameRepository } from './entities/game.repository';
import { ParticipantRepository } from './entities/participant.repository';
import { SeasonRepository } from './entities/season.repository';
import { PlayersService } from './players.service';
import { rate } from 'openskill';

@Injectable()
export class LeagueService {
  constructor(
    private readonly gamesRepository: GameRepository,
    private readonly factionsRepository: FactionRepository,
    private readonly participantsRepository: ParticipantRepository,
    private readonly seasonRepository: SeasonRepository,

    private readonly playersService: PlayersService,
  ) {
    setTimeout(() => {
      // this.parseFile();
      this.ratePlayers();
    });
  }

  async ratePlayers() {
    const games = await this.gamesRepository.find({
      // where: { season: { id: 3 } },
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
      },
      {
        player: player2,
        faction: faction2,
        score: score2,
        leagueScore: leagueScore2,
        domination: domination2,
      },
      {
        player: player3,
        faction: faction3,
        score: score3,
        leagueScore: leagueScore3,
        domination: domination3,
      },
      {
        player: player4,
        faction: faction4,
        score: score4,
        leagueScore: leagueScore4,
        domination: domination4,
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
          })
          .save();
      }),
    );
  }
}
