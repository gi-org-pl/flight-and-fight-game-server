import { Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ulid } from 'ulidx';
import { JoinSessionCommand } from '../../application/command/join-session.command';
import { GetSessionByJoinCodeQuery } from '../../application/query/get-session-by-join-code.query';
import { Session } from '../database/session.entity';
import { SessionCredentialsResponse } from './dto/session-credentials.response';
import { GenericNotFoundResponse } from '../../../../core/http/response/not-found.response';
import { JoinCodeParam } from '../../../../core/validation/decorator/join-code-param.decorator';

@ApiTags('sessions')
@Controller('sessions')
export class JoinSessionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':code/join')
  @ApiOperation({
    summary:
      'Joins an open session as the second player using the last 8 characters of its id',
  })
  @ApiCreatedResponse({ type: SessionCredentialsResponse })
  @ApiNotFoundResponse({ type: GenericNotFoundResponse })
  @ApiConflictResponse()
  async join(
    @JoinCodeParam('code') code: string,
  ): Promise<SessionCredentialsResponse> {
    const session = await this.queryBus.execute<
      GetSessionByJoinCodeQuery,
      Session
    >(new GetSessionByJoinCodeQuery(code));

    const playerId = ulid();
    await this.commandBus.execute(new JoinSessionCommand(session.id, playerId));

    return { sessionId: session.id, playerId };
  }
}
