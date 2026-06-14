import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './infra/database/entity/session.entity';
import { Player } from './infra/database/entity/player.entity';
import { PlayerCharacter } from './infra/database/entity/player-character.entity';
import { SessionRepository } from './infra/database/repository/session.repository';
import { PlayerRepository } from './infra/database/repository/player.repository';
import { PlayerGuard } from '../../core/infra/auth/player.guard';
import { CreateSessionController } from './infra/rest/create-session.controller';
import { JoinSessionController } from './infra/rest/join-session.controller';
import { GetSessionController } from './infra/rest/get-session.controller';
import { GetMyCharactersController } from './infra/rest/get-my-characters.controller';
import { GetCharactersController } from './infra/rest/get-characters.controller';
import { CreateSessionHandler } from './application/command/create-session.command';
import { JoinSessionHandler } from './application/command/join-session.command';
import { GetSessionHandler } from './application/query/get-session.query';
import { GetSessionByJoinCodeHandler } from './application/query/get-session-by-join-code.query';
import { GetMyCharactersHandler } from './application/query/get-my-characters.query';
import { GetCharactersHandler } from './application/query/get-characters.query';
import { CharactersSelectedHandler } from './application/event/characters-selected.handler';

const CommandHandlers = [CreateSessionHandler, JoinSessionHandler];
const QueryHandlers = [
  GetSessionHandler,
  GetSessionByJoinCodeHandler,
  GetMyCharactersHandler,
  GetCharactersHandler,
];
const EventHandlers = [CharactersSelectedHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Session, Player, PlayerCharacter]),
  ],
  controllers: [
    CreateSessionController,
    JoinSessionController,
    GetSessionController,
    GetMyCharactersController,
    GetCharactersController,
  ],
  providers: [
    SessionRepository,
    PlayerRepository,
    PlayerGuard,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [SessionRepository, PlayerRepository],
})
export class SessionModule {}
