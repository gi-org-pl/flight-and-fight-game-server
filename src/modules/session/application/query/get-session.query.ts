import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Session } from '../../infra/database/session.entity';
import { SessionRepository } from '../../infra/database/session.repository';

export class GetSessionQuery {
  constructor(public readonly sessionId: string) {}
}

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<
  GetSessionQuery,
  Session
> {
  constructor(private readonly sessions: SessionRepository) {}

  async execute({ sessionId }: GetSessionQuery): Promise<Session> {
    const session = await this.sessions.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session with given id does not exist.');
    }

    return session;
  }
}
