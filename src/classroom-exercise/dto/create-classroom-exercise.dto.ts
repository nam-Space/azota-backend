import { IsNotEmpty } from 'class-validator';

export class CreateClassroomExerciseDto {
  @IsNotEmpty()
  classroomId: number;

  @IsNotEmpty()
  exerciseId: number;
}
