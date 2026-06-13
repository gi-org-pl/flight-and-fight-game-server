import { ApiProperty } from '@nestjs/swagger';
import { CharacterType } from '../../../model/character/character.model';
import { Superpower } from '../../../model/character/superpowers.model';

export class CharacterStatsResponse {
  @ApiProperty({ example: 8 })
  intelligence: number;

  @ApiProperty({ example: 3 })
  defense: number;

  @ApiProperty({ example: 6 })
  power: number;

  @ApiProperty({ example: 8 })
  health: number;
}

export class CharacterResponse {
  @ApiProperty({ enum: CharacterType, example: CharacterType.VEGA })
  type: CharacterType;

  @ApiProperty({ enum: Superpower, example: Superpower.GRASS })
  superpower: Superpower;

  @ApiProperty({ type: CharacterStatsResponse })
  stats: CharacterStatsResponse;
}
