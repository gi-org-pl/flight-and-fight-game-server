import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TurnAdvancedEvent } from '../../../session/model/event/turn-advanced.event';
import { GameGateway } from '../../infra/ws/game.gateway';

@EventsHandler(TurnAdvancedEvent)
export class TurnAdvancedHandler implements IEventHandler<TurnAdvancedEvent> {
  constructor(private readonly gateway: GameGateway) {}

  async handle(event: TurnAdvancedEvent): Promise<void> {
    await this.gateway.broadcastTurnChanged(event.sessionId);
  }
}
