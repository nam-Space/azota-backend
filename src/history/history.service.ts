import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('HISTORY_REPOSITORY')
    private historyRepository: Repository<History>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto, user: IUser) {
    const history = await this.historyRepository.findOne({
      where: {
        userId: createHistoryDto.userId,
        classroomExerciseId: createHistoryDto.classroomExerciseId,
      },
      relations: {
        classroomExercise: {
          exercise: true,
        },
      },
    });

    if (history && history.classroomExercise.exercise.type === 'TEST') {
      throw new BadRequestException(
        `You took the test before! You cannot take the test again!`,
      );
    }

    const newHistory = await this.historyRepository.create({
      ...createHistoryDto,
      createdBy: user.id,
    });
    return await this.historyRepository.save(newHistory);
  }

  async findHistoryByClassroomExerciseIdAndUserId(
    classroomExerciseId: number,
    userId: number,
  ) {
    return await this.historyRepository.findOne({
      where: {
        userId,
        classroomExerciseId,
      },
    });
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.historyRepository, {
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
        score: [FilterOperator.EQ],
        userId: [FilterOperator.EQ],
        classroomExerciseId: [FilterOperator.EQ],
        totalCorrect: [FilterOperator.EQ],
        'user.name': [FilterOperator.ILIKE],
        'classroomExercise.exercise.name': [FilterOperator.ILIKE],
        'classroomExercise.classroom.name': [FilterOperator.ILIKE],
        'classroomExercise.exercise.type': [FilterOperator.EQ],
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
    return await this.historyRepository.findOne({
      where: { id: id },
      relations: {
        classroomExercise: {
          exercise: {
            questions: {
              answers: true,
            },
          },
        },
        answerHistories: {
          question: {
            answers: true,
          },
        },
      },
    });
  }

  async update(id: number, updateHistoryDto: UpdateHistoryDto, user: IUser) {
    const history = await this.historyRepository.findOne({
      where: {
        id,
      },
    });
    if (!history) {
      throw new BadRequestException(`History ${id} not found`);
    }
    return await this.historyRepository.update(
      {
        id,
      },
      {
        ...updateHistoryDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const history = await this.historyRepository.findOne({
      where: {
        id,
      },
    });
    if (!history) {
      throw new BadRequestException(`History ${id} not found`);
    }

    await this.historyRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.historyRepository.softDelete(id);
  }
}
