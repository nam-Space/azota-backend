import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAnswerHistoryDto } from './dto/create-answer-history.dto';
import { UpdateAnswerHistoryDto } from './dto/update-answer-history.dto';
import { IUser } from 'src/user/user.interface';
import { Repository } from 'typeorm';
import { AnswerHistory } from './entities/answer-history.entity';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class AnswerHistoryService {
  constructor(
    @Inject('ANSWER_HISTORY_REPOSITORY')
    private answerHistoryRepository: Repository<AnswerHistory>,
  ) {}

  async create(createAnswerHistoryDto: CreateAnswerHistoryDto, user: IUser) {
    const newAnswerHistory = await this.answerHistoryRepository.create({
      ...createAnswerHistoryDto,
      createdBy: user.id,
    });
    return await this.answerHistoryRepository.save(newAnswerHistory);
  }

  async createBulkAnswerHistory(
    createBulkAnswerHistoryDto: CreateAnswerHistoryDto[],
    user: IUser,
  ) {
    const newAnswerHistory = await this.answerHistoryRepository.create([
      ...createBulkAnswerHistoryDto.map((createAnswerHistoryDto) => {
        return {
          ...createAnswerHistoryDto,
          createdBy: user.id,
        };
      }),
    ]);
    return await this.answerHistoryRepository.save(newAnswerHistory);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.answerHistoryRepository, {
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
        'history.user.name': [FilterOperator.ILIKE],
        'question.name': [FilterOperator.ILIKE],
        'answer.name': [FilterOperator.ILIKE],
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
    return await this.answerHistoryRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateAnswerHistoryDto: UpdateAnswerHistoryDto,
    user: IUser,
  ) {
    const answerHistory = await this.answerHistoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!answerHistory) {
      throw new BadRequestException(`Answer_History ${id} not found`);
    }
    return await this.answerHistoryRepository.update(
      {
        id,
      },
      {
        ...updateAnswerHistoryDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const answerHistory = await this.answerHistoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!answerHistory) {
      throw new BadRequestException(`Answer_History ${id} not found`);
    }

    await this.answerHistoryRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.answerHistoryRepository.softDelete(id);
  }
}
