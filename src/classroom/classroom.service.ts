import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class ClassroomService {
  constructor(
    @Inject('CLASSROOM_REPOSITORY')
    private classroomRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto, user: IUser) {
    const newClassroom = await this.classroomRepository.create({
      ...createClassroomDto,
      createdBy: user.id,
    });
    return await this.classroomRepository.save(newClassroom);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.classroomRepository, {
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
        'classroomExercises.exercise.type': [FilterOperator.EQ],
        'group.name': [FilterOperator.ILIKE],
        'schoolYear.name': [FilterOperator.ILIKE],
        createdBy: [FilterOperator.EQ],
      },
      relations: qs['relations'] ? qs['relations'].split(',') : [],
      paginationType: PaginationType.LIMIT_AND_OFFSET,
      defaultLimit: 10,
      maxLimit: 10000,
    });

    return {
      meta: res.meta,
      result: res.data,
    };
  }

  async findOne(id: number) {
    return await this.classroomRepository.findOne({
      where: { id: id },
      relations: {
        userClassrooms: {
          user: true,
        },
        classroomExercises: {
          exercise: true,
          histories: true,
        },
      },
    });
  }

  async findOneByClassroomToken(classroomToken: string) {
    return await this.classroomRepository.findOne({
      where: { classroomToken },
    });
  }

  async update(
    id: number,
    updateClassroomDto: UpdateClassroomDto,
    user: IUser,
  ) {
    const classroom = await this.classroomRepository.findOne({
      where: {
        id,
      },
    });
    if (!classroom) {
      throw new BadRequestException(`Classroom ${id} not found`);
    }
    return await this.classroomRepository.update(
      {
        id,
      },
      {
        ...updateClassroomDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const classroom = await this.classroomRepository.findOne({
      where: {
        id,
      },
    });
    if (!classroom) {
      throw new BadRequestException(`Classroom ${id} not found`);
    }

    await this.classroomRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.classroomRepository.softDelete(id);
  }
}
