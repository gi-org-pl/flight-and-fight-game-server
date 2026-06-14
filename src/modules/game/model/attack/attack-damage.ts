import {
  CharacterType,
  getCharacterSuperpower,
} from '../../../session/model/character/character.model';
import {
  getDecreaseFor,
  getIncreaseFor,
} from '../../../session/model/character/superpowers.model';

const DEFAULT_DAMAGE = 1;
const SUPER_EFFECTIVE = 1.5;
const NOT_EFFECTIVE = 0.66;
const NEUTRAL = 1;

export interface PendingAttack {
  attackerId: string;
  attackingCharacter: CharacterType;
  attackedCharacter: CharacterType;
  attackDamage: number;
}

export interface AttackResolution {
  targetPlayerId: string;
  targetCharacter: CharacterType;
  damage: number;
}

function characterMultiplier(
  attacking: CharacterType,
  attacked: CharacterType,
): number {
  const attackingPower = getCharacterSuperpower(attacking);
  const attackedPower = getCharacterSuperpower(attacked);

  if (getIncreaseFor(attackingPower).includes(attackedPower)) {
    return SUPER_EFFECTIVE;
  }
  if (getDecreaseFor(attackingPower).includes(attackedPower)) {
    return NOT_EFFECTIVE;
  }
  return NEUTRAL;
}

export function calculateDamage(
  attacking: CharacterType,
  attacked: CharacterType,
  quickTimeEventMultiplier: number,
): number {
  return (
    DEFAULT_DAMAGE *
    quickTimeEventMultiplier *
    characterMultiplier(attacking, attacked)
  );
}

export function resolveAttack(
  pending: PendingAttack,
  defenderId: string,
  defenseMultiplier: number,
): AttackResolution | null {
  const defenseDamage = calculateDamage(
    pending.attackedCharacter,
    pending.attackingCharacter,
    defenseMultiplier,
  );

  if (pending.attackDamage > defenseDamage) {
    return {
      targetPlayerId: defenderId,
      targetCharacter: pending.attackedCharacter,
      damage: pending.attackDamage,
    };
  }
  if (defenseDamage > pending.attackDamage) {
    return {
      targetPlayerId: pending.attackerId,
      targetCharacter: pending.attackingCharacter,
      damage: defenseDamage,
    };
  }
  return null;
}
