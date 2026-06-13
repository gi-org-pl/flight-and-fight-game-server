import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCharactersQuery } from '../../application/query/get-characters.query';
import { Character } from '../../model/character/character.model';
import { CharacterResponse } from './dto/character.response';

@ApiTags('characters')
@Controller('api/v1/characters')
export class GetCharactersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Lists all available characters' })
  @ApiOkResponse({ type: CharacterResponse, isArray: true })
  getCharacters(): Promise<CharacterResponse[]> {
    return this.queryBus.execute<GetCharactersQuery, Character[]>(
      new GetCharactersQuery(),
    );
  }
}
