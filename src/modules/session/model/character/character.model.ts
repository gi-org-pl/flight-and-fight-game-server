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

export interface CharacterStats {
  intelligence: number;
  defense: number;
  power: number;
  health: number;
  refresh: number;
}

export interface Character {
  type: CharacterType;
  stats: CharacterStats;
}
