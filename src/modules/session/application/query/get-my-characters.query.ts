import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import { OwnedCharacter } from '../../model/character/character.model';
import { PlayerNotFoundError } from '../../model/error/session.error';

export class GetMyCharactersQuery {
  constructor(public readonly playerId: string) {}
}

@QueryHandler(GetMyCharactersQuery)
export class GetMyCharactersHandler implements IQueryHandler<
  GetMyCharactersQuery,
  OwnedCharacter[]
> {
  constructor(private readonly players: PlayerRepository) {}

  async execute({ playerId }: GetMyCharactersQuery): Promise<OwnedCharacter[]> {
    const player = await this.players.findById(playerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    return player.characters
      .map((character) => ({
        type: character.characterType,
        superpower: character.superpower,
        stats: {
          intelligence: character.intelligence,
          defense: character.defense,
          power: character.power,
          health: character.health,
        },
        isDead: character.isDead,
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }
}
