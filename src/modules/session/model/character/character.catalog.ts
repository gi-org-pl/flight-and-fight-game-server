import { Character, CharacterType, CharacterElement } from './character.model';

export const CHARACTER_CATALOG: Record<CharacterType, Character> = {
  [CharacterType.IRIS]: {
    type: CharacterType.IRIS,
    element: CharacterElement.LIGHT,
    stats: { health: 6, power: 4, defense: 4, intelligence: 9 },
  },
  [CharacterType.ZEPHYR]: {
    type: CharacterType.ZEPHYR,
    element: CharacterElement.DARK,
    stats: { health: 6, power: 5, defense: 5, intelligence: 4 },
  },
  [CharacterType.WENDY]: {
    type: CharacterType.WENDY,
    element: CharacterElement.GROUND,
    stats: { health: 8, power: 4, defense: 7, intelligence: 3 },
  },
  [CharacterType.SKYE]: {
    type: CharacterType.SKYE,
    element: CharacterElement.AIR,
    stats: { health: 7, power: 7, defense: 4, intelligence: 4 },
  },
  [CharacterType.SUNNY]: {
    type: CharacterType.SUNNY,
    element: CharacterElement.FIRE,
    stats: { health: 6, power: 8, defense: 4, intelligence: 3 },
  },
  [CharacterType.AURA]: {
    type: CharacterType.AURA,
    element: CharacterElement.ICE,
    stats: { health: 5, power: 5, defense: 6, intelligence: 7 },
  },
  [CharacterType.NEIL]: {
    type: CharacterType.NEIL,
    element: CharacterElement.WATER,
    stats: { health: 7, power: 7, defense: 5, intelligence: 7 },
  },
  [CharacterType.GALE]: {
    type: CharacterType.GALE,
    element: CharacterElement.ICE,
    stats: { health: 9, power: 7, defense: 8, intelligence: 6 },
  },
  [CharacterType.THORA]: {
    type: CharacterType.THORA,
    element: CharacterElement.ELECTRIC,
    stats: { health: 6, power: 8, defense: 3, intelligence: 5 },
  },
  [CharacterType.VEGA]: {
    type: CharacterType.VEGA,
    element: CharacterElement.GRASS,
    stats: { health: 8, power: 6, defense: 3, intelligence: 8 },
  },
};

export function getCharacter(type: CharacterType): Character {
  return CHARACTER_CATALOG[type];
}
