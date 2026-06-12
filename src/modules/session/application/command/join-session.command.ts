import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/session.repository';

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
      throw new NotFoundException('Session with given id does not exist.');
    }

    if (session.secondPlayerId !== null) {
      throw new ConflictException('Session is not open for joining.');
    }

    await this.sessions.claimSecondSlot(sessionId, secondPlayerId);
  }
}
