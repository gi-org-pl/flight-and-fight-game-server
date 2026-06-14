import { IsNumber, Max, Min } from 'class-validator';

export class DefendMessage {
  @IsNumber()
  @Min(1)
  @Max(2)
  quickTimeEventMultiplier: number;
}
