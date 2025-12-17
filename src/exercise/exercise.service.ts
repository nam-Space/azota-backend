import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject('EXERCISE_REPOSITORY')
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto, user: IUser) {
    const newClassroom = await this.exerciseRepository.create({
      ...createExerciseDto,
      createdBy: user.id,
    });
    return await this.exerciseRepository.save(newClassroom);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.exerciseRepository, {
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
        type: [FilterOperator.EQ],
        isRandomQuestion: [FilterOperator.EQ],
        isRandomAnswer: [FilterOperator.EQ],
        description: [FilterOperator.ILIKE],
        gradeId: [FilterOperator.EQ],
        'grade.name': [FilterOperator.ILIKE],
        subjectId: [FilterOperator.EQ],
        'subject.name': [FilterOperator.ILIKE],
        'classroomExercises.classroomId': [FilterOperator.EQ],
        createdBy: [FilterOperator.EQ],
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
    return await this.exerciseRepository.findOne({
      where: { id: id },
      relations: {
        classroomExercises: {
          classroom: true,
        },
        questions: {
          answers: true,
        },
      },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto, user: IUser) {
    const exercise = await this.exerciseRepository.findOne({
      where: {
        id,
      },
    });
    if (!exercise) {
      throw new BadRequestException(`Exercise ${id} not found`);
    }
    return await this.exerciseRepository.update(
      {
        id,
      },
      {
        ...updateExerciseDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const exercise = await this.exerciseRepository.findOne({
      where: {
        id,
      },
    });
    if (!exercise) {
      throw new BadRequestException(`Exercise ${id} not found`);
    }

    await this.exerciseRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.exerciseRepository.softDelete(id);
  }
}
