import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CharacterType } from '../../../session/model/character/character.model';
import { PlayerRepository } from '../../../session/infra/database/repository/player.repository';

export class ApplyDamageCommand {
  constructor(
    public readonly playerId: string,
    public readonly characterType: CharacterType,
    public readonly damage: number,
  ) {}
}

@CommandHandler(ApplyDamageCommand)
export class ApplyDamageHandler implements ICommandHandler<ApplyDamageCommand> {
  constructor(private readonly players: PlayerRepository) {}

  async execute({
    playerId,
    characterType,
    damage,
  }: ApplyDamageCommand): Promise<void> {
    await this.players.applyDamage(playerId, characterType, damage);
  }
}
