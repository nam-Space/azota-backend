import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserClassroomService } from './user-classroom.service';
import { CreateUserClassroomDto } from './dto/create-user-classroom.dto';
import { UpdateUserClassroomDto } from './dto/update-user-classroom.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { LeaveRoomDto } from './dto/leave-room.dto';

@Controller('user-classroom')
export class UserClassroomController {
  constructor(private readonly userClassroomService: UserClassroomService) {}

  @Post()
  create(
    @Body() createUserClassroomDto: CreateUserClassroomDto,
    @User() user: IUser,
  ) {
    return this.userClassroomService.create(createUserClassroomDto, user);
  }

  @Post('/leave-room')
  leaveRoom(@Body() leaveRoomDto: LeaveRoomDto, @User() user: IUser) {
    return this.userClassroomService.leaveRoom(leaveRoomDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.userClassroomService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClassroomService.findOne(+id);
  }

  @Post('/find-by-userId-and-classroomId')
  findOneByUserIdAndClassroomId(
    @Query('userId') userId,
    @Query('classroomId') classroomId,
  ) {
    return this.userClassroomService.findOneByUserIdAndClassroomId(
      +userId,
      +classroomId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserClassroomDto: UpdateUserClassroomDto,
    @User() user: IUser,
  ) {
    return this.userClassroomService.update(+id, updateUserClassroomDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.userClassroomService.remove(+id, user);
  }
}
