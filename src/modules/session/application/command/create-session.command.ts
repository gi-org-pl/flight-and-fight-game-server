import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import { CharacterType } from '../../model/character/character.model';

export class CreateSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly firstPlayerId: string,
    public readonly characters: CharacterType[],
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
    characters,
  }: CreateSessionCommand): Promise<void> {
    await this.players.create(firstPlayerId, characters);
    await this.sessions.createOpen(sessionId, firstPlayerId);

    this.logger.log(`Session ${sessionId} created by player ${firstPlayerId}`);
  }
}
