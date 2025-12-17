import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class AnswerService {
  constructor(
    @Inject('ANSWER_REPOSITORY')
    private answerRepository: Repository<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto, user: IUser) {
    const newAnswer = await this.answerRepository.create({
      ...createAnswerDto,
      createdBy: user.id,
    });
    return await this.answerRepository.save(newAnswer);
  }

  async createBulk(createAnswerBulkDto: CreateAnswerDto[], user: IUser) {
    const newAnswers = await this.answerRepository.create([
      ...createAnswerBulkDto.map((createAnswerDto) => {
        return {
          ...createAnswerDto,
          createdBy: user.id,
        };
      }),
    ]);
    return await this.answerRepository.save(newAnswers);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.answerRepository, {
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
        isCorrect: [FilterOperator.EQ],
        'question.name': [FilterOperator.ILIKE],
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
    return await this.answerRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto, user: IUser) {
    const answer = await this.answerRepository.findOne({
      where: {
        id,
      },
    });
    if (!answer) {
      throw new BadRequestException(`Answer ${id} not found`);
    }
    return await this.answerRepository.update(
      {
        id,
      },
      {
        ...updateAnswerDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const answer = await this.answerRepository.findOne({
      where: {
        id,
      },
    });
    if (!answer) {
      throw new BadRequestException(`Answer ${id} not found`);
    }

    await this.answerRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.answerRepository.softDelete(id);
  }
}
