import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/session.repository';

export class CreateSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly firstPlayerId: string,
  ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<
  CreateSessionCommand,
  void
> {
  constructor(private readonly sessions: SessionRepository) {}

  async execute({
    sessionId,
    firstPlayerId,
  }: CreateSessionCommand): Promise<void> {
    await this.sessions.createOpen(sessionId, firstPlayerId);
  }
}
