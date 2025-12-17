import { DataSource } from 'typeorm';
import { ClassroomExercise } from './entities/classroom-exercise.entity';

export const classroomExerciseProviders = [
  {
    provide: 'CLASSROOM_EXERCISE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ClassroomExercise),
    inject: ['DATA_SOURCE'],
  },
];
