import { ApiProperty } from '@nestjs/swagger';
import { CharacterType } from '../../../model/character/character.model';

export class CharacterStatsResponse {
  @ApiProperty({ example: 8 })
  intelligence: number;

  @ApiProperty({ example: 9 })
  defense: number;

  @ApiProperty({ example: 10 })
  power: number;

  @ApiProperty({ example: 10 })
  health: number;

  @ApiProperty({ example: 5 })
  refresh: number;
}

export class CharacterResponse {
  @ApiProperty({ enum: CharacterType, example: CharacterType.VEGA })
  type: CharacterType;

  @ApiProperty({ type: CharacterStatsResponse })
  stats: CharacterStatsResponse;
}
