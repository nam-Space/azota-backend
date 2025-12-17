import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class GroupService {
  constructor(
    @Inject('GROUP_REPOSITORY')
    private groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto, user: IUser) {
    const newGroup = await this.groupRepository.create({
      ...createGroupDto,
      createdBy: user.id,
    });
    return await this.groupRepository.save(newGroup);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.groupRepository, {
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
        'classrooms.name': [FilterOperator.ILIKE],
        createdBy: [FilterOperator.EQ],
        'classrooms.userClassrooms.classroomId': [FilterOperator.ILIKE],
        'classrooms.userClassrooms.userId': [FilterOperator.EQ],
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
    return await this.groupRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, user: IUser) {
    const group = await this.groupRepository.findOne({
      where: {
        id,
      },
    });
    if (!group) {
      throw new BadRequestException(`Group ${id} not found`);
    }
    return await this.groupRepository.update(
      {
        id,
      },
      {
        ...updateGroupDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const group = await this.groupRepository.findOne({
      where: {
        id,
      },
    });
    if (!group) {
      throw new BadRequestException(`Group ${id} not found`);
    }

    await this.groupRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.groupRepository.softDelete(id);
  }
}
