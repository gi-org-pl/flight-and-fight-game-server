import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { Session, SessionState } from '../entity/session.entity';

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

  async claimSecondSlot(
    id: string,
    secondPlayerId: string,
    attackingPlayerId: string,
  ): Promise<boolean> {
    const result = await this.sessions.update(
      { id, state: SessionState.OPEN, secondPlayerId: IsNull() },
      {
        secondPlayerId,
        state: SessionState.CLOSED,
        currentlyAttackingPlayerId: attackingPlayerId,
      },
    );

    return !!result.affected;
  }

  async setCurrentlyAttacking(id: string, playerId: string): Promise<void> {
    await this.sessions.update(
      { id },
      { currentlyAttackingPlayerId: playerId },
    );
  }

  findById(id: string): Promise<Session | null> {
    return this.sessions.findOne({ where: { id } });
  }

  findByJoinCode(joinCode: string): Promise<Session | null> {
    return this.sessions.findOne({ where: { id: Like(`%${joinCode}`) } });
  }
}
