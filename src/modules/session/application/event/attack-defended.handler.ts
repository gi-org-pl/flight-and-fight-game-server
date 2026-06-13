import {
  CommandBus,
  EventBus,
  EventsHandler,
  IEventHandler,
} from '@nestjs/cqrs';
import { AttackDefendedEvent } from '../../../game/model/event/attack-defended.event';
import { AdvanceTurnCommand } from '../command/advance-turn.command';
import { TurnAdvancedEvent } from '../../model/event/turn-advanced.event';

@EventsHandler(AttackDefendedEvent)
export class AttackDefendedHandler implements IEventHandler<AttackDefendedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: AttackDefendedEvent): Promise<void> {
    await this.commandBus.execute(new AdvanceTurnCommand(event.sessionId));
    this.eventBus.publish(new TurnAdvancedEvent(event.sessionId));
  }
}
