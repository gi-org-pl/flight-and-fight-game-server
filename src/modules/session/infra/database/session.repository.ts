import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Session, SessionState } from './session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessions: Repository<Session>,
  ) {}

  createOpen(id: string, firstPlayerId: string): Promise<Session> {
    const entity = this.sessions.create({
      id,
      state: SessionState.OPEN,
      firstPlayerId,
    });

    return this.sessions.save(entity);
  }

  async claimSecondSlot(id: string, secondPlayerId: string): Promise<boolean> {
    const result = await this.sessions.update(
      { id, state: SessionState.OPEN, secondPlayerId: IsNull() },
      { secondPlayerId, state: SessionState.CLOSED },
    );

    return !!result.affected;
  }

  findById(id: string): Promise<Session | null> {
    return this.sessions.findOne({ where: { id } });
  }
}
