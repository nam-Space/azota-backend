import { AnswerHistory } from 'src/answer-history/entities/answer-history.entity';
import { ClassroomExercise } from 'src/classroom-exercise/entities/classroom-exercise.entity';
import { User } from 'src/user/entities/user.entity';
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

@Entity({ name: 'history' })
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  classroomExerciseId: number;

  @Column('decimal', { nullable: true, precision: 10, scale: 2 })
  score: number;

  @Column({ nullable: true })
  totalCorrect: number;

  @Column({ nullable: true })
  duration: number;

  @ManyToOne(() => User, (user) => user.histories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AnswerHistory, (answerHistory) => answerHistory.history, {
    cascade: true,
  })
  answerHistories: AnswerHistory[];

  @ManyToOne(
    () => ClassroomExercise,
    (classroomExercise) => classroomExercise.histories,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'classroomExerciseId' })
  classroomExercise: ClassroomExercise;

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
