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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @User() user: IUser) {
    return this.questionService.create(createQuestionDto, user);
  }

  @Post('create-bulk')
  createBulk(
    @Body()
    createQuestionBulkDto: CreateQuestionDto[],
    @User() user: IUser,
  ) {
    return this.questionService.createBulk(createQuestionBulkDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.questionService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @User() user: IUser,
  ) {
    return this.questionService.update(+id, updateQuestionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.questionService.remove(+id, user);
  }
}
