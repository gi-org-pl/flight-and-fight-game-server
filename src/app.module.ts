import { Module } from '@nestjs/common';
import { StatusController } from 'src/modules/status/status.controller';
import { SessionModule } from 'src/modules/session/session.module';
import { GameModule } from 'src/modules/game/game.module';
import { DatabaseModule } from 'src/core/infra/database/database.module';

@Module({
  imports: [DatabaseModule, SessionModule, GameModule],
  controllers: [StatusController],
})
export class AppModule {}
