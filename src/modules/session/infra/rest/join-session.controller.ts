import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ulid } from 'ulidx';
import { JoinSessionCommand } from '../../application/command/join-session.command';
import { SessionCredentialsResponse } from './dto/session-credentials.response';
import { GenericNotFoundResponse } from '../../../../core/http/response/not-found.response';
import { UlidParam } from '../../../../core/validation/decorator/ulid-param.decorator';

@ApiTags('sessions')
@Controller('sessions')
export class JoinSessionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':id/join')
  @ApiOperation({ summary: 'Joins an open session as the second player' })
  @ApiCreatedResponse({ type: SessionCredentialsResponse })
  @ApiNotFoundResponse({ type: GenericNotFoundResponse })
  @ApiConflictResponse()
  async join(@UlidParam('id') id: string): Promise<SessionCredentialsResponse> {
    const playerId = ulid();

    await this.commandBus.execute(new JoinSessionCommand(id, playerId));

    return { sessionId: id, playerId };
  }
}
