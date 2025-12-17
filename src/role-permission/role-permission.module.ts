import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { DatabaseModule } from 'src/database/database.module';
import { rolePermissionProviders } from './role-permission.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, ...rolePermissionProviders],
})
export class RolePermissionModule {}
