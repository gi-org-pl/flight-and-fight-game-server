import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { PlayerRepository } from '../../infra/database/repository/player.repository';

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
  private readonly logger = new Logger(CreateSessionHandler.name);

  constructor(
    private readonly sessions: SessionRepository,
    private readonly players: PlayerRepository,
  ) {}

  async execute({
    sessionId,
    firstPlayerId,
  }: CreateSessionCommand): Promise<void> {
    await this.players.create(firstPlayerId);
    await this.sessions.createOpen(sessionId, firstPlayerId);

    this.logger.log(`Session ${sessionId} created by player ${firstPlayerId}`);
  }
}
