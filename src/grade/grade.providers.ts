import { DataSource } from 'typeorm';
import { Grade } from './entities/grade.entity';

export const gradeProviders = [
  {
    provide: 'GRADE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Grade),
    inject: ['DATA_SOURCE'],
  },
];
