import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
} from 'class-validator';
import { CharacterType } from '../../../../session/model/character/character.model';

export class SelectCharactersMessage {
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsEnum(CharacterType, { each: true })
  characters: CharacterType[];
}
