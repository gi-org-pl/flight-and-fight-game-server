import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../session/infra/database/repository/session.repository';

export class FinishSessionCommand {
  constructor(public readonly sessionId: string) {}
}

@CommandHandler(FinishSessionCommand)
export class FinishSessionHandler implements ICommandHandler<FinishSessionCommand> {
  constructor(private readonly sessions: SessionRepository) {}

  async execute({ sessionId }: FinishSessionCommand): Promise<void> {
    await this.sessions.markFinished(sessionId);
  }
}
