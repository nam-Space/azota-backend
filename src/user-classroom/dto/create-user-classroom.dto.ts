import { IsNotEmpty } from 'class-validator';

export class CreateUserClassroomDto {
  @IsNotEmpty()
  classroomId: number;

  @IsNotEmpty()
  userId: number;
}
