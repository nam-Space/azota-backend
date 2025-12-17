import { DataSource } from 'typeorm';
import { History } from './entities/history.entity';

export const historyProviders = [
  {
    provide: 'HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(History),
    inject: ['DATA_SOURCE'],
  },
];
