import { AnswerHistory } from 'src/answer-history/entities/answer-history.entity';
import { Question } from 'src/question/entities/question.entity';
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

@Entity({ name: 'answer' })
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ nullable: true })
  questionId: number;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @OneToMany(() => AnswerHistory, (answerHistory) => answerHistory.answer, {
    cascade: true,
  })
  answerHistories: AnswerHistory[];

  @Column({ nullable: true })
  isCorrect: boolean;

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
