import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { answerProviders } from './answer.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AnswerController],
  providers: [AnswerService, ...answerProviders],
})
export class AnswerModule {}
