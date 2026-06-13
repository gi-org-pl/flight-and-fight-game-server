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
      'OPEN while waiting for the second player, CLOSED once both joined',
    enum: SessionState,
    example: SessionState.OPEN,
  })
  state: SessionState;

  @ApiProperty({
    description: 'ULID of the player who created the session',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FBW',
  })
  firstPlayerId: string;

  @ApiProperty({
    description: 'ULID of the player who joined, null while still OPEN',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FCX',
    nullable: true,
  })
  secondPlayerId: string | null;

  @ApiProperty({
    description:
      'ULID of the player whose turn it is to attack, null while still OPEN; the initiator attacks first',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FBW',
    nullable: true,
  })
  currentlyAttackingPlayerId: string | null;
}
