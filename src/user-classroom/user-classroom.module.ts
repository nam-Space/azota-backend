import { Module } from '@nestjs/common';
import { UserClassroomService } from './user-classroom.service';
import { UserClassroomController } from './user-classroom.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userClassroomProviders } from './user-classroom.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UserClassroomController],
  providers: [UserClassroomService, ...userClassroomProviders],
})
export class UserClassroomModule {}
