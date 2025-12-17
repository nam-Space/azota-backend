import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { DatabaseModule } from 'src/database/database.module';
import { classroomProviders } from './classroom.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ClassroomController],
  providers: [ClassroomService, ...classroomProviders],
})
export class ClassroomModule {}
