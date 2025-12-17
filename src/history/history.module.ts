import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { historyProviders } from './history.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HistoryController],
  providers: [HistoryService, ...historyProviders],
})
export class HistoryModule {}
