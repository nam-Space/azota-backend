import { IsNotEmpty } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  timeStart: Date;

  @IsNotEmpty()
  timeEnd: Date;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  isRandomQuestion: boolean;

  @IsNotEmpty()
  isRandomAnswer: boolean;

  @IsNotEmpty()
  gradeId: number;

  @IsNotEmpty()
  subjectId: number;
}
