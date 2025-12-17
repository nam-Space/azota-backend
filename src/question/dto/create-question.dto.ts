import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  exerciseId: number;
}
