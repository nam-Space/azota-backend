import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { In, Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { IUser } from 'src/user/user.interface';
import { PaginateQuery, PaginationType, paginate } from 'nestjs-paginate';

@Injectable()
export class RolePermissionService {
  constructor(
    @Inject('ROLE_PERMISSION_REPOSITORY')
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createRolePermissionDto: CreateRolePermissionDto, user: IUser) {
    const data = await this.rolePermissionRepository.create({
      ...createRolePermissionDto,
      createdBy: user.id,
    });
    return await this.rolePermissionRepository.save(data);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.rolePermissionRepository, {
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
      paginationType: PaginationType.LIMIT_AND_OFFSET,
      defaultLimit: 10,
    });

    return {
      meta: res.meta,
      result: res.data,
    };
  }

  async findOne(id: number) {
    return await this.rolePermissionRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateRolePermissionDto: UpdateRolePermissionDto,
    user: IUser,
  ) {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!rolePermission) {
      throw new BadRequestException(`Role_Permission ${id} not found`);
    }
    return await this.rolePermissionRepository.update(
      {
        id,
      },
      {
        ...updateRolePermissionDto,
        updatedBy: user.id,
      },
    );
  }

  async insertAndDelete(roleId: number, permissionsId: number[], user: IUser) {
    await this.rolePermissionRepository.delete({ roleId: In([roleId]) });
    const rolePermissions = await this.rolePermissionRepository.create([
      ...permissionsId.map((permissionId) => {
        return {
          roleId: roleId,
          permissionId: permissionId,
          createdBy: user.id,
        };
      }),
    ]);

    return await this.rolePermissionRepository.save(rolePermissions);
  }

  async remove(id: number, user: IUser) {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!rolePermission) {
      throw new BadRequestException(`Role_Permission ${id} not found`);
    }

    await this.rolePermissionRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.rolePermissionRepository.softDelete(id);
  }
}
