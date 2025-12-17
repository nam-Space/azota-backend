import { Module } from '@nestjs/common';
import { AnswerHistoryService } from './answer-history.service';
import { AnswerHistoryController } from './answer-history.controller';
import { DatabaseModule } from 'src/database/database.module';
import { answerHistoryProviders } from './answer-history.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AnswerHistoryController],
  providers: [AnswerHistoryService, ...answerHistoryProviders],
})
export class AnswerHistoryModule {}
