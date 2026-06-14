import { CharacterType } from '../../../session/model/character/character.model';

export class CharacterDiedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly playerId: string,
    public readonly characterType: CharacterType,
  ) {}
}
