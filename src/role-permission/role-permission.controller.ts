import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/user/user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
    @User() user: IUser,
  ) {
    return this.rolePermissionService.create(createRolePermissionDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.rolePermissionService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
    @User() user: IUser,
  ) {
    return this.rolePermissionService.update(
      +id,
      updateRolePermissionDto,
      user,
    );
  }

  @Post('/insertAndDelete')
  insertAndDelete(
    @Query('roleId') roleId: string,
    @Body() permissionsId: number[],
    @User() user: IUser,
  ) {
    return this.rolePermissionService.insertAndDelete(
      +roleId,
      permissionsId,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolePermissionService.remove(+id, user);
  }
}
