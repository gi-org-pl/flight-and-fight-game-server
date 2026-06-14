import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CharacterType } from '../../../session/model/character/character.model';
import { PlayerRepository } from '../../../session/infra/database/repository/player.repository';
import { CharacterDiedEvent } from '../../model/event/character-died.event';

export class ApplyDamageCommand {
  constructor(
    public readonly sessionId: string,
    public readonly playerId: string,
    public readonly characterType: CharacterType,
    public readonly damage: number,
  ) {}
}

@CommandHandler(ApplyDamageCommand)
export class ApplyDamageHandler implements ICommandHandler<ApplyDamageCommand> {
  constructor(
    private readonly players: PlayerRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({
    sessionId,
    playerId,
    characterType,
    damage,
  }: ApplyDamageCommand): Promise<void> {
    const { newlyDied } = await this.players.applyDamage(
      playerId,
      characterType,
      damage,
    );

    if (newlyDied) {
      this.eventBus.publish(
        new CharacterDiedEvent(sessionId, playerId, characterType),
      );
    }
  }
}
