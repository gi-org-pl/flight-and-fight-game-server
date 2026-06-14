import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameFinishedEvent } from '../../model/event/game-finished.event';
import { FinishSessionCommand } from '../command/finish-session.command';
import { GameGateway } from '../../infra/ws/game.gateway';

@EventsHandler(GameFinishedEvent)
export class GameFinishedHandler implements IEventHandler<GameFinishedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gateway: GameGateway,
  ) {}

  async handle(event: GameFinishedEvent): Promise<void> {
    await this.commandBus.execute(new FinishSessionCommand(event.sessionId));
    this.gateway.broadcastGameFinished(
      event.sessionId,
      event.winnerId,
      event.loserId,
    );
  }
}
