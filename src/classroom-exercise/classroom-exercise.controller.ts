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
import { ClassroomExerciseService } from './classroom-exercise.service';
import { CreateClassroomExerciseDto } from './dto/create-classroom-exercise.dto';
import { UpdateClassroomExerciseDto } from './dto/update-classroom-exercise.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public, User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';

@Controller('classroom-exercise')
export class ClassroomExerciseController {
  constructor(
    private readonly classroomExerciseService: ClassroomExerciseService,
  ) {}

  @Post()
  create(
    @Body() createClassroomExerciseDto: CreateClassroomExerciseDto,
    @User() user: IUser,
  ) {
    return this.classroomExerciseService.create(
      createClassroomExerciseDto,
      user,
    );
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.classroomExerciseService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomExerciseService.findOne(+id);
  }

  @Post('/by-classroomId-and-exerciseId')
  findOneByClassroomIdAndExerciseId(
    @Query('classroomId') classroomId: string,
    @Query('exerciseId') exerciseId: string,
  ) {
    return this.classroomExerciseService.findOneByClassroomIdAndExerciseId(
      +classroomId,
      +exerciseId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassroomExerciseDto: UpdateClassroomExerciseDto,
    @User() user: IUser,
  ) {
    return this.classroomExerciseService.update(
      +id,
      updateClassroomExerciseDto,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.classroomExerciseService.remove(+id, user);
  }
}
