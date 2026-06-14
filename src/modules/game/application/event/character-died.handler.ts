import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CharacterDiedEvent } from '../../model/event/character-died.event';
import { GameGateway } from '../../infra/ws/game.gateway';

@EventsHandler(CharacterDiedEvent)
export class CharacterDiedHandler implements IEventHandler<CharacterDiedEvent> {
  constructor(private readonly gateway: GameGateway) {}

  handle(event: CharacterDiedEvent): void {
    this.gateway.broadcastCharacterDied(
      event.sessionId,
      event.playerId,
      event.characterType,
    );
  }
}
