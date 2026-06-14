import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { CharacterType } from '../../../../session/model/character/character.model';

export class AttackMessage {
  @IsNumber()
  @Min(1)
  @Max(2)
  quickTimeEventMultiplier: number;

  @IsEnum(CharacterType)
  attackingCharacter: CharacterType;

  @IsEnum(CharacterType)
  attackedCharacter: CharacterType;
}
