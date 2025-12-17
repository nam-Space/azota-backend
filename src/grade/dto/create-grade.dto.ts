import { IsNotEmpty } from 'class-validator';

export class CreateGradeDto {
  @IsNotEmpty()
  name: string;
}
