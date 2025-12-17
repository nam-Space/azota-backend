import { DataSource } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

export const classroomProviders = [
  {
    provide: 'CLASSROOM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Classroom),
    inject: ['DATA_SOURCE'],
  },
];
