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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto, @User() user: IUser) {
    return this.subjectService.create(createSubjectDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.subjectService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @User() user: IUser,
  ) {
    return this.subjectService.update(+id, updateSubjectDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subjectService.remove(+id, user);
  }
}
