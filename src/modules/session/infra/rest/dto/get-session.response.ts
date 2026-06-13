import { ApiProperty } from '@nestjs/swagger';
import { SessionState } from '../../database/entity/session.entity';

export class GetSessionResponse {
  @ApiProperty({
    description: 'ULID of the session, also used as the join code',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
  })
  id: string;

  @ApiProperty({
    description:
      'WAITING_FOR_SECOND_PLAYER until an opponent joins, WAITING_FOR_CHARACTER_CHOICE until both players pick their characters, READY once the game can start',
    enum: SessionState,
    example: SessionState.WAITING_FOR_SECOND_PLAYER,
  })
  state: SessionState;

  @ApiProperty({
    description: 'ULID of the player who created the session',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FBW',
  })
  firstPlayerId: string;

  @ApiProperty({
    description: 'ULID of the player who joined, null until an opponent joins',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FCX',
    nullable: true,
  })
  secondPlayerId: string | null;

  @ApiProperty({
    description:
      'ULID of the player whose turn it is to attack, null until the game is READY; the initiator attacks first',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FBW',
    nullable: true,
  })
  currentlyAttackingPlayerId: string | null;
}
