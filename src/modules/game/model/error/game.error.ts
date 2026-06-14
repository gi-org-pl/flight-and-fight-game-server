import { WsException } from '@nestjs/websockets';

export class NotYourTurnError extends WsException {
  constructor() {
    super('It is not your turn to attack.');
  }
}

export class AttackAlreadyPendingError extends WsException {
  constructor() {
    super('An attack is already awaiting defense.');
  }
}

export class NotDefendingPlayerError extends WsException {
  constructor() {
    super('Only the defending player can defend.');
  }
}

export class NoAttackToDefendError extends WsException {
  constructor() {
    super('There is no attack to defend against.');
  }
}

export class CharactersLockedError extends WsException {
  constructor() {
    super('Characters can no longer be changed.');
  }
}
