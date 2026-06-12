import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './infra/database/session.entity';
import { SessionRepository } from './infra/database/session.repository';
import { CreateSessionController } from './infra/rest/create-session.controller';
import { JoinSessionController } from './infra/rest/join-session.controller';
import { GetSessionController } from './infra/rest/get-session.controller';
import { CreateSessionHandler } from './application/command/create-session.command';
import { JoinSessionHandler } from './application/command/join-session.command';
import { GetSessionHandler } from './application/query/get-session.query';

const CommandHandlers = [CreateSessionHandler, JoinSessionHandler];
const QueryHandlers = [GetSessionHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Session])],
  controllers: [
    CreateSessionController,
    JoinSessionController,
    GetSessionController,
  ],
  providers: [SessionRepository, ...CommandHandlers, ...QueryHandlers],
})
export class SessionModule {}
