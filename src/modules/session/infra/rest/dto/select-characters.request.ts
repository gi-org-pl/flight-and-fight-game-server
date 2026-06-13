import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
} from 'class-validator';
import { CharacterType } from '../../../model/character/character.model';

export class SelectCharactersRequest {
  @ApiProperty({
    enum: CharacterType,
    isArray: true,
    example: [
      CharacterType.IRIS,
      CharacterType.SKYE,
      CharacterType.SUNNY,
      CharacterType.THORA,
      CharacterType.VEGA,
    ],
  })
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsEnum(CharacterType, { each: true })
  characters: CharacterType[];
}
