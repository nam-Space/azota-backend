import { IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  classroomExerciseId: number;

  @IsNotEmpty()
  score: number;

  @IsNotEmpty()
  totalCorrect: number;

  @IsNotEmpty()
  duration: number;
}
