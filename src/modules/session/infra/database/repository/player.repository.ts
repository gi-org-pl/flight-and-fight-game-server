import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterType } from '../../../model/character/character.model';
import { Player } from '../entity/player.entity';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly players: Repository<Player>,
  ) {}

  create(id: string, characters: CharacterType[]): Promise<Player> {
    const player = this.players.create({
      id,
      characters: characters.map((characterType) => ({ characterType })),
    });

    return this.players.save(player);
  }

  findById(id: string): Promise<Player | null> {
    return this.players.findOne({
      where: { id },
      relations: { characters: true },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.players.countBy({ id });

    return count > 0;
  }
}
