import { Character, CharacterType } from './character.model';

export const CHARACTER_CATALOG: Record<CharacterType, Character> = {
  [CharacterType.IRIS]: {
    type: CharacterType.IRIS,
    stats: { intelligence: 4, defense: 3, power: 3, health: 5, refresh: 6 },
  },
  [CharacterType.ZEPHYR]: {
    type: CharacterType.ZEPHYR,
    stats: { intelligence: 3, defense: 5, power: 3, health: 6, refresh: 4 },
  },
  [CharacterType.WENDY]: {
    type: CharacterType.WENDY,
    stats: { intelligence: 7, defense: 3, power: 2, health: 4, refresh: 5 },
  },
  [CharacterType.SKYE]: {
    type: CharacterType.SKYE,
    stats: { intelligence: 5, defense: 5, power: 6, health: 6, refresh: 6 },
  },
  [CharacterType.SUNNY]: {
    type: CharacterType.SUNNY,
    stats: { intelligence: 6, defense: 4, power: 7, health: 5, refresh: 7 },
  },
  [CharacterType.AURA]: {
    type: CharacterType.AURA,
    stats: { intelligence: 8, defense: 5, power: 5, health: 5, refresh: 6 },
  },
  [CharacterType.NEIL]: {
    type: CharacterType.NEIL,
    stats: { intelligence: 6, defense: 6, power: 7, health: 7, refresh: 5 },
  },
  [CharacterType.GALE]: {
    type: CharacterType.GALE,
    stats: { intelligence: 7, defense: 8, power: 8, health: 9, refresh: 6 },
  },
  [CharacterType.THORA]: {
    type: CharacterType.THORA,
    stats: { intelligence: 9, defense: 6, power: 8, health: 8, refresh: 9 },
  },
  [CharacterType.VEGA]: {
    type: CharacterType.VEGA,
    stats: { intelligence: 8, defense: 9, power: 10, health: 10, refresh: 5 },
  },
};

export function getCharacter(type: CharacterType): Character {
  return CHARACTER_CATALOG[type];
}
