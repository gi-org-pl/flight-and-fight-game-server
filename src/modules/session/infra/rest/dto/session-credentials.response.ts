import { ApiProperty } from '@nestjs/swagger';

export class SessionCredentialsResponse {
  @ApiProperty({
    description: 'ULID of the session, also used as the join code',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
  })
  sessionId: string;

  @ApiProperty({
    description: 'ULID identifying the player within the session',
    example: '01ARZ3NDEKTSV4RRFFQ69G5FBW',
  })
  playerId: string;
}
