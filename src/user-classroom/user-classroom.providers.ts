import { DataSource } from 'typeorm';
import { UserClassroom } from './entities/user-classroom.entity';

export const userClassroomProviders = [
  {
    provide: 'USER_CLASSROOM_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserClassroom),
    inject: ['DATA_SOURCE'],
  },
];
