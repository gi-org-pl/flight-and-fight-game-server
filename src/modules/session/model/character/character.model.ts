import { Superpower } from './superpowers.model';

export enum CharacterType {
  IRIS = 'IRIS',
  ZEPHYR = 'ZEPHYR',
  WENDY = 'WENDY',
  SKYE = 'SKYE',
  SUNNY = 'SUNNY',
  AURA = 'AURA',
  NEIL = 'NEIL',
  GALE = 'GALE',
  THORA = 'THORA',
  VEGA = 'VEGA',
}

const characterSuperpowers: Record<CharacterType, Superpower> = {
  [CharacterType.IRIS]: Superpower.LIGHT,
  [CharacterType.ZEPHYR]: Superpower.DARK,
  [CharacterType.WENDY]: Superpower.GROUND,
  [CharacterType.SKYE]: Superpower.AIR,
  [CharacterType.SUNNY]: Superpower.FIRE,
  [CharacterType.AURA]: Superpower.ICE,
  [CharacterType.NEIL]: Superpower.WATER,
  [CharacterType.GALE]: Superpower.ICE,
  [CharacterType.THORA]: Superpower.ELECTRIC,
  [CharacterType.VEGA]: Superpower.GRASS,
};

export function getCharacterSuperpower(character: CharacterType): Superpower {
  return characterSuperpowers[character];
}

export interface CharacterStats {
  intelligence: number;
  defense: number;
  power: number;
  health: number;
}

export interface Character {
  type: CharacterType;
  superpower: Superpower;
  stats: CharacterStats;
}

export interface OwnedCharacter extends Character {
  isDead: boolean;
}
