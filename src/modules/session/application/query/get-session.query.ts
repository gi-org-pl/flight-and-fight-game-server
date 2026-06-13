import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Session } from '../../infra/database/entity/session.entity';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { SessionNotFoundError } from '../../model/error/session.error';

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
      throw new SessionNotFoundError();
    }

    return session;
  }
}
