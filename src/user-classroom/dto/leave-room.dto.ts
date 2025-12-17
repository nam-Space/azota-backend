import { IsNotEmpty } from 'class-validator';

export class LeaveRoomDto {
  @IsNotEmpty()
  classroomId: number;

  @IsNotEmpty()
  userId: number;
}
