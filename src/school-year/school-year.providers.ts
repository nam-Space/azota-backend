import { DataSource } from 'typeorm';
import { SchoolYear } from './entities/school-year.entity';

export const schoolYearProviders = [
  {
    provide: 'SCHOOL_YEAR_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SchoolYear),
    inject: ['DATA_SOURCE'],
  },
];
