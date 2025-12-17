import { Module } from '@nestjs/common';
import { ClassroomExerciseService } from './classroom-exercise.service';
import { ClassroomExerciseController } from './classroom-exercise.controller';
import { classroomExerciseProviders } from './classroom-exercise.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClassroomExerciseController],
  providers: [ClassroomExerciseService, ...classroomExerciseProviders],
})
export class ClassroomExerciseModule {}
