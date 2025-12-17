import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class PermissionService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const newPermission = await this.permissionRepository.create({
      ...createPermissionDto,
      createdBy: user.id,
    });
    return await this.permissionRepository.save(newPermission);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.permissionRepository, {
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
        module: [FilterOperator.ILIKE],
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
    return await this.permissionRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    const { name, endpoint, method, module } = updatePermissionDto;
    const permission = await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!permission) {
      throw new BadRequestException(`Permission ${id} not found`);
    }

    return await this.permissionRepository.update(
      {
        id,
      },
      {
        name,
        endpoint,
        method,
        module,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const permission = await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!permission) {
      throw new BadRequestException(`Permission ${id} not found`);
    }

    await this.permissionRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.permissionRepository.softDelete(id);
  }
}
