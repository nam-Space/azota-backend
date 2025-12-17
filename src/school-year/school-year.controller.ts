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
import { SchoolYearService } from './school-year.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { Public, User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('school-year')
export class SchoolYearController {
  constructor(private readonly schoolYearService: SchoolYearService) {}

  @Post()
  create(
    @Body() createSchoolYearDto: CreateSchoolYearDto,
    @User() user: IUser,
  ) {
    return this.schoolYearService.create(createSchoolYearDto, user);
  }

  @Public()
  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.schoolYearService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolYearService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
    @User() user: IUser,
  ) {
    return this.schoolYearService.update(+id, updateSchoolYearDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.schoolYearService.remove(+id, user);
  }
}
