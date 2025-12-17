import { PartialType } from '@nestjs/mapped-types';
import { CreateUserClassroomDto } from './create-user-classroom.dto';

export class UpdateUserClassroomDto extends PartialType(CreateUserClassroomDto) {}
