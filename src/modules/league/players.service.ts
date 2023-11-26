import { Injectable } from '@nestjs/common';
import { rating } from 'openskill';
import { Rating } from 'openskill/dist/types';
import { PlayerEntity } from './entities/player.entity';
import { PlayerRepository } from './entities/player.repository';

@Injectable()
export class PlayersService {
  ratings: Record<string, { games: number; rating: Rating }> = {};
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getOrCreatePlayer(rootId: string) {
    const player = await this.playerRepository.findByRootId(rootId);

    return player ?? this.playerRepository.create({ rootId }).save();
  }

  getPlayerRating(player: PlayerEntity) {
    if (!this.ratings[player.id]) {
      this.ratings[player.id] = { games: 0, rating: rating() };
    }

    return this.ratings[player.id].rating;
  }

  updatePlayerRating(player: PlayerEntity, rating: Rating) {
    this.ratings[player.id] = {
      games: this.ratings[player.id].games + 1,
      rating,
    };
  }

  async prepareRating() {
    const arr = Object.entries(this.ratings)
      .filter((item) => item[1].games >= 15)
      .sort((a, b) => b[1].rating.mu - a[1].rating.mu)
      .map((item) => [item[0], item[1].games, item[1].rating.mu]);
    const result = await Promise.all(
      arr.map(async (item) => {
        const player = await this.playerRepository.findOne({
          where: { id: item[0].toString() },
        });
        return [player.rootId, item[1], item[2]];
      }),
    );
    let i = 0;
    for (const item of result) {
      i = i + 1;
      console.log(i, item[0], item[1], item[2]);
    }
  }
}
