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

export enum CharacterElement {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  FIRE = 'FIRE',
  GRASS = 'GRASS',
  WATER = 'WATER',
  ELECTRIC = 'ELECTRIC',
  AIR = 'AIR',
  GROUND = 'GROUND',
  ICE = 'ICE',
}

export interface CharacterStats {
  health: number;
  power: number;
  defense: number;
  intelligence: number;
}

export interface Character {
  type: CharacterType;
  element: CharacterElement;
  stats: CharacterStats;
  strong?: CharacterElement;
  weak?: CharacterElement;
}
