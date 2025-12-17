import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { Repository } from 'typeorm';
import { SchoolYear } from './entities/school-year.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class SchoolYearService {
  constructor(
    @Inject('SCHOOL_YEAR_REPOSITORY')
    private schoolYearRepository: Repository<SchoolYear>,
  ) {}

  async create(createSchoolYearDto: CreateSchoolYearDto, user: IUser) {
    const newSchoolYear = await this.schoolYearRepository.create({
      ...createSchoolYearDto,
      createdBy: user.id,
    });
    return await this.schoolYearRepository.save(newSchoolYear);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.schoolYearRepository, {
      // ['id', 'name']
      sortableColumns: qs['sort']
        ? [
            ...(Array.from(qs['sort'].split(',')).map((q) => {
              return (q as string).split('-')[0];
            }) as any),
          ]
        : ['id'],

      // [['name', 'ASC'], ['email', 'DESC']]
      defaultSortBy: qs['sort']
        ? [
            ...(Array.from(qs['sort'].split(',')).map((q) => {
              return (q as string).split('-');
            }) as any),
          ]
        : [['id', 'ASC']],
      select: qs['select'] ? ['id', ...qs['select'].split(',')] : [],
      filterableColumns: {
        name: [FilterOperator.ILIKE],
      },
      relations: qs['relations'] ? qs['relations'].split(',') : [],
      paginationType: PaginationType.LIMIT_AND_OFFSET,
      defaultLimit: 10,
    });

    return {
      meta: res.meta,
      result: res.data,
    };
  }

  async findOne(id: number) {
    return await this.schoolYearRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateSchoolYearDto: UpdateSchoolYearDto,
    user: IUser,
  ) {
    const schoolYear = await this.schoolYearRepository.findOne({
      where: {
        id,
      },
    });
    if (!schoolYear) {
      throw new BadRequestException(`School Year ${id} not found`);
    }

    return await this.schoolYearRepository.update(
      {
        id,
      },
      {
        ...updateSchoolYearDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const schoolYear = await this.schoolYearRepository.findOne({
      where: {
        id,
      },
    });
    if (!schoolYear) {
      throw new BadRequestException(`School Year ${id} not found`);
    }

    await this.schoolYearRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.schoolYearRepository.softDelete(id);
  }
}
