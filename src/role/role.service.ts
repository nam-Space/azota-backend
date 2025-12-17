import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const newRole = await this.roleRepository.create({
      ...createRoleDto,
      createdBy: user.id,
    });
    return await this.roleRepository.save(newRole);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.roleRepository, {
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
    return await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name } = updateRoleDto;
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    if (!role) {
      throw new BadRequestException(`Role ${id} not found`);
    }
    return await this.roleRepository.update(
      {
        id,
      },
      {
        name,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    if (!role) {
      throw new BadRequestException(`Role ${id} not found`);
    }
    await this.roleRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.roleRepository.softDelete(id);
  }
}
