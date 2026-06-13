import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameReadyEvent } from '../../../session/model/event/game-ready.event';
import { GameGateway } from '../../infra/ws/game.gateway';

@EventsHandler(GameReadyEvent)
export class GameReadyHandler implements IEventHandler<GameReadyEvent> {
  constructor(private readonly gateway: GameGateway) {}

  async handle(event: GameReadyEvent): Promise<void> {
    await this.gateway.broadcastReady(event.sessionId);
  }
}
