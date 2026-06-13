import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { SessionNotFoundError } from '../../model/error/session.error';

export class AdvanceTurnCommand {
  constructor(public readonly sessionId: string) {}
}

@CommandHandler(AdvanceTurnCommand)
export class AdvanceTurnHandler implements ICommandHandler<AdvanceTurnCommand> {
  constructor(private readonly sessions: SessionRepository) {}

  async execute({ sessionId }: AdvanceTurnCommand): Promise<void> {
    const session = await this.sessions.findById(sessionId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    const nextAttacker =
      session.currentlyAttackingPlayerId === session.firstPlayerId
        ? session.secondPlayerId
        : session.firstPlayerId;

    await this.sessions.setCurrentlyAttacking(
      sessionId,
      nextAttacker as string,
    );
  }
}
