import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserClassroomDto } from './dto/create-user-classroom.dto';
import { UpdateUserClassroomDto } from './dto/update-user-classroom.dto';
import { Repository } from 'typeorm';
import { UserClassroom } from './entities/user-classroom.entity';
import { IUser } from 'src/user/user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';
import { LeaveRoomDto } from './dto/leave-room.dto';

@Injectable()
export class UserClassroomService {
  constructor(
    @Inject('USER_CLASSROOM_REPOSITORY')
    private userClassroomRepository: Repository<UserClassroom>,
  ) {}

  async create(createUserClassroomDto: CreateUserClassroomDto, user: IUser) {
    const userClassroom = await this.userClassroomRepository.findOne({
      where: {
        classroomId: createUserClassroomDto.classroomId,
        userId: createUserClassroomDto.userId,
      },
    });
    if (userClassroom) {
      throw new BadRequestException(`User_Classroom already exists!`);
    }
    const newUserClassroom = await this.userClassroomRepository.create({
      ...createUserClassroomDto,
      createdBy: user.id,
    });
    return await this.userClassroomRepository.save(newUserClassroom);
  }

  async leaveRoom(leaveRoomDto: LeaveRoomDto, user: IUser) {
    const { classroomId, userId } = leaveRoomDto;
    const userClassroom = await this.userClassroomRepository.findOne({
      where: {
        classroomId,
        userId,
      },
    });
    if (!userClassroom) {
      throw new BadRequestException(`User_Classroom not found`);
    }

    await this.userClassroomRepository.update(
      {
        id: userClassroom.id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.userClassroomRepository.softDelete(userClassroom.id);
  }

  async findOneByUserIdAndClassroomId(userId: number, classroomId: number) {
    return await this.userClassroomRepository.findOne({
      where: {
        userId,
        classroomId,
      },
    });
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.userClassroomRepository, {
      // ['id', 'name']
      sortableColumns: qs['sort']
        ? [
            ...(Array.from(qs['sort'].split(',')).map((q) => {
              return (q as string).split('-')[0];
            }) as any),
          ]
        : ['id'],

      // [['name', 'ASC'], ['email', 'DESC']]
      defaultSortBy: qs['sort']
        ? [
            ...(Array.from(qs['sort'].split(',')).map((q) => {
              return (q as string).split('-');
            }) as any),
          ]
        : [['id', 'ASC']],
      select: qs['select'] ? ['id', ...qs['select'].split(',')] : [],
      filterableColumns: {
        classroomId: [FilterOperator.EQ],
        userId: [FilterOperator.EQ],
        'classroom.name': [FilterOperator.ILIKE],
        'user.name': [FilterOperator.ILIKE],
      },
      relations: qs['relations'] ? qs['relations'].split(',') : [],
      paginationType: PaginationType.LIMIT_AND_OFFSET,
      defaultLimit: 10,
    });

    return {
      meta: res.meta,
      result: res.data,
    };
  }

  async findOne(id: number) {
    return await this.userClassroomRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateUserClassroomDto: UpdateUserClassroomDto,
    user: IUser,
  ) {
    const userClassroom = await this.userClassroomRepository.findOne({
      where: {
        id,
      },
    });
    if (!userClassroom) {
      throw new BadRequestException(`User_Classroom ${id} not found`);
    }

    return await this.userClassroomRepository.update(
      {
        id,
      },
      {
        ...updateUserClassroomDto,
        updatedBy: user.id,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const userClassroom = await this.userClassroomRepository.findOne({
      where: {
        id,
      },
    });
    if (!userClassroom) {
      throw new BadRequestException(`User_Classroom ${id} not found`);
    }

    await this.userClassroomRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.userClassroomRepository.softDelete(id);
  }
}
