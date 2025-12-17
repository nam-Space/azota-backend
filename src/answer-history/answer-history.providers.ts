import { DataSource } from 'typeorm';
import { AnswerHistory } from './entities/answer-history.entity';

export const answerHistoryProviders = [
  {
    provide: 'ANSWER_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AnswerHistory),
    inject: ['DATA_SOURCE'],
  },
];
