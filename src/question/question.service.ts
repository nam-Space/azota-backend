import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('QUESTION_REPOSITORY')
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, user: IUser) {
    const question = await this.questionRepository.create({
      ...createQuestionDto,
      createdBy: user.id,
    });
    return await this.questionRepository.save(question);
  }

  async createBulk(createQuestionBulkDto: CreateQuestionDto[], user: IUser) {
    const questions = await this.questionRepository.create([
      ...createQuestionBulkDto.map((createQuestionDto) => {
        return {
          ...createQuestionDto,
          createdBy: user.id,
        };
      }),
    ]);
    return await this.questionRepository.save(questions);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.questionRepository, {
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
        endpoint: [FilterOperator.ILIKE],
        method: [FilterOperator.ILIKE],
        module: [FilterOperator.EQ],
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
    return await this.questionRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto, user: IUser) {
    const question = await this.questionRepository.findOne({
      where: {
        id,
      },
    });
    if (!question) {
      throw new BadRequestException(`Question ${id} not found`);
    }

    return await this.questionRepository.update(
      {
        id,
      },
      {
        ...updateQuestionDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const question = await this.questionRepository.findOne({
      where: {
        id,
      },
    });
    if (!question) {
      throw new BadRequestException(`Question ${id} not found`);
    }

    await this.questionRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.questionRepository.softDelete(id);
  }
}
