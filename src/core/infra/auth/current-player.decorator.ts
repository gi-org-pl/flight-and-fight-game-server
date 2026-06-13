import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PlayerRequest } from './player.guard';

export const CurrentPlayerId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<PlayerRequest>();
    return request.playerId as string;
  },
);
