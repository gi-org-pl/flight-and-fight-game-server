import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterType } from '../../../model/character/character.model';
import { Player } from '../entity/player.entity';
import { PlayerCharacter } from '../entity/player-character.entity';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly players: Repository<Player>,
    @InjectRepository(PlayerCharacter)
    private readonly characters: Repository<PlayerCharacter>,
  ) {}

  create(id: string): Promise<Player> {
    const player = this.players.create({ id });

    return this.players.save(player);
  }

  async setCharacters(id: string, characters: CharacterType[]): Promise<void> {
    await this.characters.delete({ playerId: id });
    await this.characters.insert(
      characters.map((characterType) => ({ playerId: id, characterType })),
    );
  }

  async hasFullSelection(id: string): Promise<boolean> {
    const count = await this.characters.countBy({ playerId: id });

    return count === 5;
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
