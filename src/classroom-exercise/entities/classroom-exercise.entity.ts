import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Exercise } from 'src/exercise/entities/exercise.entity';
import { History } from 'src/history/entities/history.entity';
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

@Entity({ name: 'classroom_exercise' })
export class ClassroomExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  classroomId: number;

  @Column({ nullable: true })
  exerciseId: number;

  @ManyToOne(() => Classroom, (classroom) => classroom.classroomExercises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom;

  @ManyToOne(() => Exercise, (exercise) => exercise.classroomExercises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @OneToMany(() => History, (history) => history.classroomExercise, {
    cascade: true,
  })
  histories: History[];

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
