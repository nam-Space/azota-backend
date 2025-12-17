import { Answer } from 'src/answer/entities/answer.entity';
import { History } from 'src/history/entities/history.entity';
import { Question } from 'src/question/entities/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'answer_history' })
export class AnswerHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  historyId: number;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerChoosenId: number;

  @ManyToOne(() => History, (history) => history.answerHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'historyId' })
  history: History;

  @ManyToOne(() => Question, (question) => question.answerHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.answerHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'answerChoosenId' })
  answer: Answer;

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
