import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GameGateway } from './infra/ws/game.gateway';
import { TurnAdvancedHandler } from './application/event/turn-advanced.handler';
import { GameReadyHandler } from './application/event/game-ready.handler';

@Module({
  imports: [CqrsModule],
  providers: [GameGateway, TurnAdvancedHandler, GameReadyHandler],
})
export class GameModule {}
