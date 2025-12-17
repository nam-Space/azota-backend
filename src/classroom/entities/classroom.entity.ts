import { ClassroomExercise } from 'src/classroom-exercise/entities/classroom-exercise.entity';
import { Group } from 'src/group/entities/group.entity';
import { SchoolYear } from 'src/school-year/entities/school-year.entity';
import { UserClassroom } from 'src/user-classroom/entities/user-classroom.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'classroom' })
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ nullable: true })
  groupId: number;

  @Column({ nullable: true })
  schoolYearId: number;

  @Column({ type: 'text', nullable: true })
  classroomToken: string;

  @OneToMany(() => UserClassroom, (userClassroom) => userClassroom.classroom, {
    cascade: true,
  })
  userClassrooms: UserClassroom[];

  @OneToMany(
    () => ClassroomExercise,
    (classroomExercise) => classroomExercise.classroom,
    {
      cascade: true,
    },
  )
  classroomExercises: ClassroomExercise[];

  @ManyToOne(() => Group, (group) => group.classrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.classrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'schoolYearId' })
  schoolYear: SchoolYear;

  @Column({ nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: true })
  deletedBy: number;
}
