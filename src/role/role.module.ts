import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DatabaseModule } from 'src/database/database.module';
import { roleProviders } from './role.providers';
import { userProviders } from 'src/user/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService],
})
export class RoleModule {}
