import { CharacterType } from '../../../session/model/character/character.model';

export class CharactersSelectedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly playerId: string,
    public readonly characters: CharacterType[],
  ) {}
}
