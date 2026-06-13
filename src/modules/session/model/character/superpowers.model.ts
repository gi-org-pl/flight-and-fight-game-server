export enum Superpower {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  WATER = 'WATER',
  GRASS = 'GRASS',
  FIRE = 'FIRE',
  ELECTRIC = 'ELECTRIC',
  GROUND = 'GROUND',
  AIR = 'AIR',
  ICE = 'ICE',
}

const superpowerIncrease: Record<Superpower, Superpower[]> = {
  [Superpower.LIGHT]: [Superpower.DARK],
  [Superpower.DARK]: [Superpower.LIGHT],
  [Superpower.WATER]: [Superpower.FIRE, Superpower.GROUND],
  [Superpower.GRASS]: [Superpower.WATER],
  [Superpower.FIRE]: [Superpower.GRASS, Superpower.ICE],
  [Superpower.ELECTRIC]: [Superpower.WATER],
  [Superpower.GROUND]: [Superpower.ELECTRIC, Superpower.AIR],
  [Superpower.AIR]: [Superpower.FIRE],
  [Superpower.ICE]: [Superpower.WATER],
};

export function getIncreaseFor(superpower: Superpower): Superpower[] {
  return superpowerIncrease[superpower];
}

const superpowerDecrease: Partial<typeof superpowerIncrease> = {
  [Superpower.WATER]: [Superpower.GRASS],
  [Superpower.GRASS]: [Superpower.FIRE],
  [Superpower.FIRE]: [Superpower.WATER],
  [Superpower.ELECTRIC]: [Superpower.GROUND],
};

export function getDecreaseFor(superpower: Superpower): Superpower[] {
  return superpowerDecrease[superpower] ?? [];
}
