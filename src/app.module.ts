import { Module } from '@nestjs/common';
import { StatusController } from 'src/modules/status/status.controller';
import { SessionModule } from 'src/modules/session/session.module';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [DatabaseModule, SessionModule],
  controllers: [StatusController],
})
export class AppModule {}
