import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { isValid as isValidUlid } from 'ulidx';
import { PlayerRepository } from '../../../modules/session/infra/database/repository/player.repository';

export interface PlayerRequest extends Request {
  playerId?: string;
}

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(private readonly players: PlayerRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PlayerRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const playerId = type === 'Bearer' ? token : undefined;

    if (!playerId || !isValidUlid(playerId)) {
      throw new UnauthorizedException();
    }

    if (!(await this.players.exists(playerId))) {
      throw new UnauthorizedException();
    }

    request.playerId = playerId;
    return true;
  }
}
