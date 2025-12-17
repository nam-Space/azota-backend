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
import { AnswerHistoryService } from './answer-history.service';
import { CreateAnswerHistoryDto } from './dto/create-answer-history.dto';
import { UpdateAnswerHistoryDto } from './dto/update-answer-history.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('answer-history')
export class AnswerHistoryController {
  constructor(private readonly answerHistoryService: AnswerHistoryService) {}

  @Post()
  create(
    @Body() createAnswerHistoryDto: CreateAnswerHistoryDto,
    @User() user: IUser,
  ) {
    return this.answerHistoryService.create(createAnswerHistoryDto, user);
  }

  @Post('create-bulk')
  createBulkAnswerHistory(
    @Body() createBulkAnswerHistoryDto: CreateAnswerHistoryDto[],
    @User() user: IUser,
  ) {
    return this.answerHistoryService.createBulkAnswerHistory(
      createBulkAnswerHistoryDto,
      user,
    );
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.answerHistoryService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerHistoryDto: UpdateAnswerHistoryDto,
    @User() user: IUser,
  ) {
    return this.answerHistoryService.update(+id, updateAnswerHistoryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.answerHistoryService.remove(+id, user);
  }
}
