import { Module } from '@nestjs/common';
import { SchoolYearService } from './school-year.service';
import { SchoolYearController } from './school-year.controller';
import { schoolYearProviders } from './school-year.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SchoolYearController],
  providers: [SchoolYearService, ...schoolYearProviders],
})
export class SchoolYearModule {}
