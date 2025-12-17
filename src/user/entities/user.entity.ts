import { History } from 'src/history/entities/history.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserClassroom } from 'src/user-classroom/entities/user-classroom.entity';
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

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ nullable: true })
  birthDay: Date;

  @Column({ length: 255, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  gender: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'text', nullable: true })
  passwordToken: string;

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => UserClassroom, (userClassroom) => userClassroom.user, {
    cascade: true,
  })
  userClassrooms: UserClassroom[];

  @OneToMany(() => History, (history) => history.user, {
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
