import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class GradeService {
  constructor(
    @Inject('GRADE_REPOSITORY')
    private gradeRepository: Repository<Grade>,
  ) {}

  async create(createGradeDto: CreateGradeDto, user: IUser) {
    const newGrade = await this.gradeRepository.create({
      ...createGradeDto,
      createdBy: user.id,
    });
    return await this.gradeRepository.save(newGrade);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.gradeRepository, {
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
        name: [FilterOperator.EQ],
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
    return await this.gradeRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateGradeDto: UpdateGradeDto, user: IUser) {
    const grade = await this.gradeRepository.findOne({
      where: {
        id,
      },
    });
    if (!grade) {
      throw new BadRequestException(`Grade ${id} not found`);
    }
    return await this.gradeRepository.update(
      {
        id,
      },
      {
        ...updateGradeDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const grade = await this.gradeRepository.findOne({
      where: {
        id,
      },
    });
    if (!grade) {
      throw new BadRequestException(`Grade ${id} not found`);
    }

    await this.gradeRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.gradeRepository.softDelete(id);
  }
}
