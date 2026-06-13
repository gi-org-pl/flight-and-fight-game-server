import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ulid } from 'ulidx';
import { CreateSessionCommand } from '../../application/command/create-session.command';
import { SelectCharactersRequest } from './dto/select-characters.request';
import { SessionCredentialsResponse } from './dto/session-credentials.response';

@ApiTags('sessions')
@Controller('api/v1/sessions')
export class CreateSessionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new game session as the first player' })
  @ApiCreatedResponse({ type: SessionCredentialsResponse })
  async create(
    @Body() body: SelectCharactersRequest,
  ): Promise<SessionCredentialsResponse> {
    const sessionId = ulid();
    const playerId = ulid();

    await this.commandBus.execute(
      new CreateSessionCommand(sessionId, playerId, body.characters),
    );

    return { sessionId, playerId };
  }
}
