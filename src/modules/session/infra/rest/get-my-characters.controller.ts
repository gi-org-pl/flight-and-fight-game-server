import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetMyCharactersQuery } from '../../application/query/get-my-characters.query';
import { Character } from '../../model/character/character.model';
import { CharacterResponse } from './dto/character.response';
import { UnauthorizedResponse } from '../../../../core/infra/http/response/unauthorized.response';
import { PlayerGuard } from '../../../../core/infra/auth/player.guard';
import { CurrentPlayerId } from '../../../../core/infra/auth/current-player.decorator';

@ApiTags('user stats')
@Controller('api/v1/my-characters')
export class GetMyCharactersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: "Returns the current player's selected characters" })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: CharacterResponse, isArray: true })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  getMyCharacters(
    @CurrentPlayerId() playerId: string,
  ): Promise<CharacterResponse[]> {
    return this.queryBus.execute<GetMyCharactersQuery, Character[]>(
      new GetMyCharactersQuery(playerId),
    );
  }
}
