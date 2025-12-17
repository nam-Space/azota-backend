import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomExerciseDto } from './create-classroom-exercise.dto';

export class UpdateClassroomExerciseDto extends PartialType(CreateClassroomExerciseDto) {}
