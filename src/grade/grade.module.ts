import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { DatabaseModule } from 'src/database/database.module';
import { gradeProviders } from './grade.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GradeController],
  providers: [GradeService, ...gradeProviders],
})
export class GradeModule {}
