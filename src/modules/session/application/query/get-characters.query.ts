import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CHARACTER_CATALOG } from '../../model/character/character.catalog';
import { Character } from '../../model/character/character.model';

export class GetCharactersQuery {}

@QueryHandler(GetCharactersQuery)
export class GetCharactersHandler implements IQueryHandler<
  GetCharactersQuery,
  Character[]
> {
  async execute(): Promise<Character[]> {
    return Object.values(CHARACTER_CATALOG).sort((a, b) =>
      a.type.localeCompare(b.type),
    );
  }
}
