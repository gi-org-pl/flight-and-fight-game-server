import { ApiProperty } from '@nestjs/swagger';
import { CharacterType, CharacterElement } from '../../../model/character/character.model';

export class CharacterStatsResponse {
  @ApiProperty({ example: 10 })
  health: number;

  @ApiProperty({ example: 10 })
  power: number;

  @ApiProperty({ example: 10 })
  defense: number;

  @ApiProperty({ example: 10 })
  intelligence: number;
}

export class CharacterResponse {
  @ApiProperty({ enum: CharacterType, example: CharacterType.VEGA })
  type: CharacterType;

  @ApiProperty({ enum: CharacterElement, example: CharacterElement.GRASS })
  element: CharacterElement;

  @ApiProperty({ type: CharacterStatsResponse })
  stats: CharacterStatsResponse;
}
