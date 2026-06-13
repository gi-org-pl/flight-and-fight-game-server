import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Session } from '../../infra/database/entity/session.entity';
import { SessionRepository } from '../../infra/database/repository/session.repository';
import { SessionByJoinCodeNotFoundError } from '../../model/error/session.error';

export class GetSessionByJoinCodeQuery {
  constructor(public readonly joinCode: string) {}
}

@QueryHandler(GetSessionByJoinCodeQuery)
export class GetSessionByJoinCodeHandler implements IQueryHandler<
  GetSessionByJoinCodeQuery,
  Session
> {
  constructor(private readonly sessions: SessionRepository) {}

  async execute({ joinCode }: GetSessionByJoinCodeQuery): Promise<Session> {
    const session = await this.sessions.findByJoinCode(joinCode);

    if (!session) {
      throw new SessionByJoinCodeNotFoundError();
    }

    return session;
  }
}
