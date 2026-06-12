export class Session {
  id: string;
  firstPlayer: Player;
  secondPlayer: Player;
}

export class Player {
  id: string;
}

export class CurrentPlayerCharacter {
  id: string;
  name: string;
  type: string;
  attacks: Attack[];
}

export class Attack {
  id: string;
  name: string;
  strength: number;
  specialEffects: SpecialEffect[];
}

export type SpecialEffect = 'heal' | 'damage' | 'timeout';
