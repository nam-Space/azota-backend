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
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto, @User() user: IUser) {
    return this.exerciseService.create(createExerciseDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.exerciseService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @User() user: IUser,
  ) {
    return this.exerciseService.update(+id, updateExerciseDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.exerciseService.remove(+id, user);
  }
}
