import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CharactersSelectedEvent } from '../../../game/model/event/characters-selected.event';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { PlayerRepository } from '../../infra/database/repository/player.repository';
import { GameReadyEvent } from '../../model/event/game-ready.event';

@EventsHandler(CharactersSelectedEvent)
export class CharactersSelectedHandler implements IEventHandler<CharactersSelectedEvent> {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly players: PlayerRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: CharactersSelectedEvent): Promise<void> {
    const { sessionId, playerId, characters } = event;

    await this.players.setCharacters(playerId, characters);

    const session = await this.sessions.findById(sessionId);
    if (!session || session.secondPlayerId === null) {
      return;
    }

    const [firstReady, secondReady] = await Promise.all([
      this.players.hasFullSelection(session.firstPlayerId),
      this.players.hasFullSelection(session.secondPlayerId),
    ]);
    if (!firstReady || !secondReady) {
      return;
    }

    const transitioned = await this.sessions.markReady(
      sessionId,
      session.firstPlayerId,
    );
    if (transitioned) {
      this.eventBus.publish(new GameReadyEvent(sessionId));
    }
  }
}
