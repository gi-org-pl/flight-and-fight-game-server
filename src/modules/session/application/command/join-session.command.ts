import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import {
  SessionNotFoundError,
  SessionNotOpenError,
} from '../../model/error/session.error';

export class JoinSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly secondPlayerId: string,
  ) {}
}

@CommandHandler(JoinSessionCommand)
export class JoinSessionHandler implements ICommandHandler<JoinSessionCommand> {
  private readonly logger = new Logger(JoinSessionHandler.name);

  constructor(
    private readonly sessions: SessionRepository,
    private readonly players: PlayerRepository,
  ) {}

  async execute(command: JoinSessionCommand): Promise<void> {
    const { sessionId, secondPlayerId } = command;

    const session = await this.sessions.findById(sessionId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.secondPlayerId !== null) {
      throw new SessionNotOpenError();
    }

    await this.players.create(secondPlayerId);
    await this.sessions.claimSecondSlot(sessionId, secondPlayerId);

    this.logger.log(`Player ${secondPlayerId} joined session ${sessionId}`);
  }
}
