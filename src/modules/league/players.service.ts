import { Injectable } from '@nestjs/common';
import { rating } from 'openskill';
import { Rating } from 'openskill/dist/types';
import { PlayerEntity } from './entities/player.entity';
import { PlayerRepository } from './entities/player.repository';

const formatName = (name: string) => {
  while (name.length < 25) {
    name = name + ' ';
  }
  return name;
};

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
      .map((item) => [
        item[0],
        item[1].games,
        item[1].rating.mu,
        item[1].rating.sigma,
      ]);
    const result = await Promise.all(
      arr.map(async (item): Promise<[string, number, number, number]> => {
        const player = await this.playerRepository.findOne({
          where: { id: item[0].toString() },
        });
        return [
          player.rootId,
          item[1] as number,
          item[2] as number,
          item[3] as number,
        ];
      }),
    );
    let i = 0;
    for (const item of result) {
      i = i + 1;
      console.log(
        ('00' + i.toString()).slice(-3),
        formatName(item[0] as string),
        ('00' + item[1].toString()).slice(-3),
        item[2].toFixed(2),
        item[3].toFixed(2),
      );
    }
  }
}
