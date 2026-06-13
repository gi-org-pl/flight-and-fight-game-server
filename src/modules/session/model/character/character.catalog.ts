import {
  Character,
  CharacterType,
  getCharacterSuperpower,
} from './character.model';

const CHARACTER_CATALOG: Record<CharacterType, Character> = {
  [CharacterType.IRIS]: {
    type: CharacterType.IRIS,
    superpower: getCharacterSuperpower(CharacterType.IRIS),
    stats: { health: 6, power: 4, defense: 4, intelligence: 9 },
  },
  [CharacterType.ZEPHYR]: {
    type: CharacterType.ZEPHYR,
    superpower: getCharacterSuperpower(CharacterType.ZEPHYR),
    stats: { health: 6, power: 5, defense: 5, intelligence: 4 },
  },
  [CharacterType.WENDY]: {
    type: CharacterType.WENDY,
    superpower: getCharacterSuperpower(CharacterType.WENDY),
    stats: { health: 8, power: 4, defense: 7, intelligence: 3 },
  },
  [CharacterType.SKYE]: {
    type: CharacterType.SKYE,
    superpower: getCharacterSuperpower(CharacterType.SKYE),
    stats: { health: 7, power: 7, defense: 4, intelligence: 4 },
  },
  [CharacterType.SUNNY]: {
    type: CharacterType.SUNNY,
    superpower: getCharacterSuperpower(CharacterType.SUNNY),
    stats: { health: 6, power: 8, defense: 4, intelligence: 3 },
  },
  [CharacterType.AURA]: {
    type: CharacterType.AURA,
    superpower: getCharacterSuperpower(CharacterType.AURA),
    stats: { health: 5, power: 5, defense: 6, intelligence: 7 },
  },
  [CharacterType.NEIL]: {
    type: CharacterType.NEIL,
    superpower: getCharacterSuperpower(CharacterType.NEIL),
    stats: { health: 7, power: 7, defense: 5, intelligence: 7 },
  },
  [CharacterType.GALE]: {
    type: CharacterType.GALE,
    superpower: getCharacterSuperpower(CharacterType.GALE),
    stats: { health: 9, power: 7, defense: 8, intelligence: 6 },
  },
  [CharacterType.THORA]: {
    type: CharacterType.THORA,
    superpower: getCharacterSuperpower(CharacterType.THORA),
    stats: { health: 6, power: 8, defense: 3, intelligence: 5 },
  },
  [CharacterType.VEGA]: {
    type: CharacterType.VEGA,
    superpower: getCharacterSuperpower(CharacterType.VEGA),
    stats: { health: 8, power: 6, defense: 3, intelligence: 8 },
  },
};

export function getAllCharacters(): Character[] {
  return Object.values(CHARACTER_CATALOG);
}

export function getCharacter(type: CharacterType): Character {
  return CHARACTER_CATALOG[type];
}
