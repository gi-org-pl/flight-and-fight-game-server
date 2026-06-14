import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionModule } from '../session/session.module';
import { GameGateway } from './infra/ws/game.gateway';
import { AdvanceTurnHandler } from './application/command/advance-turn.command';
import { ApplyDamageHandler } from './application/command/apply-damage.command';
import { FinishSessionHandler } from './application/command/finish-session.command';
import { AttackDefendedHandler } from './application/event/attack-defended.handler';
import { CharacterDiedHandler } from './application/event/character-died.handler';
import { GameFinishedHandler } from './application/event/game-finished.handler';
import { TurnAdvancedHandler } from './application/event/turn-advanced.handler';
import { GameReadyHandler } from './application/event/game-ready.handler';

@Module({
  imports: [CqrsModule, SessionModule],
  providers: [
    GameGateway,
    AdvanceTurnHandler,
    ApplyDamageHandler,
    FinishSessionHandler,
    AttackDefendedHandler,
    CharacterDiedHandler,
    GameFinishedHandler,
    TurnAdvancedHandler,
    GameReadyHandler,
  ],
})
export class GameModule {}
