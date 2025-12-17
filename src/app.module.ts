import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { RoleModule } from './role/role.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { PermissionModule } from './permission/permission.module';
import { ClassroomModule } from './classroom/classroom.module';
import { UserClassroomModule } from './user-classroom/user-classroom.module';
import { GradeModule } from './grade/grade.module';
import { SubjectModule } from './subject/subject.module';
import { ExerciseModule } from './exercise/exercise.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { HistoryModule } from './history/history.module';
import { AnswerHistoryModule } from './answer-history/answer-history.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { ClassroomExerciseModule } from './classroom-exercise/classroom-exercise.module';
import { GroupModule } from './group/group.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    RoleModule,
    RolePermissionModule,
    PermissionModule,
    ClassroomModule,
    UserClassroomModule,
    GradeModule,
    SubjectModule,
    ExerciseModule,
    QuestionModule,
    AnswerModule,
    HistoryModule,
    AnswerHistoryModule,
    AuthModule,
    FileModule,
    ClassroomExerciseModule,
    GroupModule,
    SchoolYearModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
