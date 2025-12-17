import { IsNotEmpty } from 'class-validator';

export class CreateAnswerHistoryDto {
  @IsNotEmpty()
  historyId: number;

  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  answerChoosenId: number;
}
