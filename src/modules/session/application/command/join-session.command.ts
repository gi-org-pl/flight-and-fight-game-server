import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/session.repository';
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
  constructor(private readonly sessions: SessionRepository) {}

  async execute(command: JoinSessionCommand): Promise<void> {
    const { sessionId, secondPlayerId } = command;

    const session = await this.sessions.findById(sessionId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.secondPlayerId !== null) {
      throw new SessionNotOpenError();
    }

    await this.sessions.claimSecondSlot(sessionId, secondPlayerId);
  }
}
