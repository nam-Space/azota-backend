import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateClassroomExerciseDto } from './dto/create-classroom-exercise.dto';
import { UpdateClassroomExerciseDto } from './dto/update-classroom-exercise.dto';
import { Repository } from 'typeorm';
import { ClassroomExercise } from './entities/classroom-exercise.entity';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class ClassroomExerciseService {
  constructor(
    @Inject('CLASSROOM_EXERCISE_REPOSITORY')
    private classroomExerciseRepository: Repository<ClassroomExercise>,
  ) {}

  async create(
    createClassroomExerciseDto: CreateClassroomExerciseDto,
    user: IUser,
  ) {
    const newData = await this.classroomExerciseRepository.create({
      ...createClassroomExerciseDto,
      createdBy: user.id,
    });

    return await this.classroomExerciseRepository.save(newData);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.classroomExerciseRepository, {
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
        createdBy: [FilterOperator.EQ],
        'classroom.id': [FilterOperator.EQ],
        'classroom.name': [FilterOperator.ILIKE],
        'classroom.createdBy': [FilterOperator.EQ],
        'exercise.id': [FilterOperator.EQ],
        'exercise.name': [FilterOperator.ILIKE],
        'exercise.createdBy': [FilterOperator.EQ],
        'exercise.type': [FilterOperator.EQ],
      },
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
    return await this.classroomExerciseRepository.findOne({
      where: { id: id },
      relations: {
        classroom: true,
        exercise: true,
      },
    });
  }

  async findOneByClassroomIdAndExerciseId(
    classroomId: number,
    exerciseId: number,
  ) {
    return await this.classroomExerciseRepository.findOne({
      where: {
        classroomId,
        exerciseId,
      },
      relations: {
        exercise: {
          questions: true,
        },
        classroom: {
          userClassrooms: true,
        },
        histories: true,
      },
    });
  }

  async update(
    id: number,
    updateClassroomExerciseDto: UpdateClassroomExerciseDto,
    user: IUser,
  ) {
    const classroomExercise = await this.classroomExerciseRepository.findOne({
      where: {
        id,
      },
    });
    if (!classroomExercise) {
      throw new BadRequestException(`Classroom Exercise ${id} not found`);
    }
    return await this.classroomExerciseRepository.update(
      {
        id,
      },
      {
        ...updateClassroomExerciseDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const classroomExercise = await this.classroomExerciseRepository.findOne({
      where: {
        id,
      },
    });
    if (!classroomExercise) {
      throw new BadRequestException(`Classroom Exercise ${id} not found`);
    }

    await this.classroomExerciseRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );

    return await this.classroomExerciseRepository.softDelete(id);
  }
}
