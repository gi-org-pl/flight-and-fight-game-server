import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import { CharacterType } from '../../model/character/character.model';
import {
  SessionNotFoundError,
  SessionNotOpenError,
} from '../../model/error/session.error';

export class JoinSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly secondPlayerId: string,
    public readonly characters: CharacterType[],
  ) {}
}

@CommandHandler(JoinSessionCommand)
export class JoinSessionHandler implements ICommandHandler<JoinSessionCommand> {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly players: PlayerRepository,
  ) {}

  async execute(command: JoinSessionCommand): Promise<void> {
    const { sessionId, secondPlayerId, characters } = command;

    const session = await this.sessions.findById(sessionId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.secondPlayerId !== null) {
      throw new SessionNotOpenError();
    }

    await this.players.create(secondPlayerId, characters);
    await this.sessions.claimSecondSlot(
      sessionId,
      secondPlayerId,
      session.firstPlayerId,
    );
  }
}
