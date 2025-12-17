import { ClassroomExercise } from 'src/classroom-exercise/entities/classroom-exercise.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import { Question } from 'src/question/entities/question.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'exercise' })
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  timeStart: Date;

  @Column({ nullable: true })
  timeEnd: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  isRandomQuestion: boolean;

  @Column({ nullable: true })
  isRandomAnswer: boolean;

  @Column({ nullable: true })
  gradeId: number;

  @ManyToOne(() => Grade, (grade) => grade.exercises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gradeId' })
  grade: Grade;

  @Column({ nullable: true })
  subjectId: number;

  @ManyToOne(() => Subject, (subject) => subject.exercises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @OneToMany(() => Question, (question) => question.exercise, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(
    () => ClassroomExercise,
    (classroomExercise) => classroomExercise.exercise,
    {
      cascade: true,
    },
  )
  classroomExercises: ClassroomExercise[];

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
