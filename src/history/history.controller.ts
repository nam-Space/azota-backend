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
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto, @User() user: IUser) {
    return this.historyService.create(createHistoryDto, user);
  }

  @Post('/by-classroomExerciseId-and-userId')
  findHistoryByClassroomExerciseIdAndUserId(
    @Query('classroomExerciseId') classroomExerciseId: string,
    @Query('userId') userId: string,
  ) {
    return this.historyService.findHistoryByClassroomExerciseIdAndUserId(
      +classroomExerciseId,
      +userId,
    );
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.historyService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoryDto: UpdateHistoryDto,
    @User() user: IUser,
  ) {
    return this.historyService.update(+id, updateHistoryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.historyService.remove(+id, user);
  }
}
