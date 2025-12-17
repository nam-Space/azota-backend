import { IsNotEmpty } from 'class-validator';

export class CreateSchoolYearDto {
  @IsNotEmpty()
  name: string;
}
