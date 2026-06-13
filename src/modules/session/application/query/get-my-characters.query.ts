import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import { getCharacter } from '../../model/character/character.catalog';
import { Character } from '../../model/character/character.model';
import { PlayerNotFoundError } from '../../model/error/session.error';

export class GetMyCharactersQuery {
  constructor(public readonly playerId: string) {}
}

@QueryHandler(GetMyCharactersQuery)
export class GetMyCharactersHandler implements IQueryHandler<
  GetMyCharactersQuery,
  Character[]
> {
  constructor(private readonly players: PlayerRepository) {}

  async execute({ playerId }: GetMyCharactersQuery): Promise<Character[]> {
    const player = await this.players.findById(playerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    return player.characters
      .map((character) => getCharacter(character.characterType))
      .sort((a, b) => a.type.localeCompare(b.type));
  }
}
