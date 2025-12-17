import { IsNotEmpty } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  groupId: number;

  @IsNotEmpty()
  schoolYearId: number;

  @IsNotEmpty()
  classroomToken: string;
}
