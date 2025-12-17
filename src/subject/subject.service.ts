import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('SUBJECT_REPOSITORY')
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto, user: IUser) {
    const subject = await this.subjectRepository.create({
      ...createSubjectDto,
      createdBy: user.id,
    });
    return await this.subjectRepository.save(subject);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.subjectRepository, {
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
      relations: qs['relations'] ? qs['relations'].split(',') : [],
      filterableColumns: {
        name: [FilterOperator.ILIKE],
      },
      paginationType: PaginationType.LIMIT_AND_OFFSET,
      defaultLimit: 10,
    });

    return {
      meta: res.meta,
      result: res.data,
    };
  }

  async findOne(id: number) {
    return await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto, user: IUser) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
    if (!subject) {
      throw new BadRequestException(`Subject ${id} not found`);
    }

    return await this.subjectRepository.update(
      {
        id,
      },
      {
        ...updateSubjectDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
    if (!subject) {
      throw new BadRequestException(`Subject ${id} not found`);
    }

    await this.subjectRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.subjectRepository.softDelete(id);
  }
}
