import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { Role } from 'src/role/entities/role.entity';
import { IUser } from './user.interface';
import {
  FilterOperator,
  PaginateQuery,
  PaginationType,
  paginate,
} from 'nestjs-paginate';
import { GetUserByEmailAndPasswordTokenDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,

    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  updateUserToken = async (refreshToken: string, id: number) => {
    return await this.userRepository.update(
      {
        id,
      },
      {
        refreshToken: refreshToken,
      },
    );
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
      createdBy: user.id,
    });
    return await this.userRepository.save(newUser);
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, gender } = registerUserDto;
    const checkUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (checkUser) {
      throw new BadRequestException(`Email ${email} đã tồn tại!`);
    }

    const userRole = await this.roleRepository.findOne({
      where: { name: 'STUDENT' },
    });

    const newUser = await this.userRepository.create({
      name,
      email,
      password: this.hashPassword(password),
      gender,
      roleId: userRole.id,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(path: PaginateQuery, qs: string) {
    const res = await paginate(path, this.userRepository, {
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
        name: [FilterOperator.ILIKE],
        email: [FilterOperator.ILIKE],
        gender: [FilterOperator.EQ],
        phone: [FilterOperator.ILIKE],
        'userClassrooms.classroom.classroomExercises.exerciseId': [
          FilterOperator.EQ,
        ],
        'userClassrooms.classroom.classroomExercises.classroomId': [
          FilterOperator.EQ,
        ],
        'histories.score': [FilterOperator.EQ],
        'role.name': [FilterOperator.EQ],
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

  async findOneByUsername(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userRepository.findOne({
      where: {
        refreshToken,
      },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });
  };

  async update(id: number, updateUserDto: UpdateUserDto, user: IUser) {
    const { email, name, birthDay, phone, gender, avatar, roleId } =
      updateUserDto;
    const userDb = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userDb) {
      throw new BadRequestException(`User ${id} does not exist`);
    }
    return await this.userRepository.update(
      {
        id,
      },
      {
        email,
        name,
        birthDay,
        phone,
        gender,
        avatar,
        roleId,
        updatedBy: user.id,
      },
    );
  }

  async updateUserProfile(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
    user: IUser,
  ) {
    return await this.userRepository.update(
      { id },
      {
        ...updateUserProfileDto,
        updatedBy: user.id,
      },
    );
  }

  async updateUserPassword(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto,
    user: IUser,
  ) {
    const { password, new_password, renew_password } = updateUserPasswordDto;

    const userDb = await this.userRepository.findOne({
      where: { id },
    });

    if (!this.isValidPassword(password, userDb.password)) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    if (password === new_password) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }
    if (new_password !== renew_password) {
      throw new BadRequestException(
        'Mật khẩu nhập lại phải giống mật khẩu mới',
      );
    }

    return await this.userRepository.update(
      { id },
      {
        password: this.hashPassword(new_password),
        updatedBy: user.id,
        passwordToken: null,
      },
    );
  }

  async getUserEmailAndPasswordToken(
    getUserByEmailAndPasswordTokenDto: GetUserByEmailAndPasswordTokenDto,
  ) {
    const { email, passwordToken } = getUserByEmailAndPasswordTokenDto;
    const userDb = await this.userRepository.findOne({
      where: {
        email,
        passwordToken,
      },
      select: {
        password: false,
      },
    });
    if (!userDb) {
      throw new BadRequestException(
        'Link đã không còn hiệu lực! Xin vui lòng thử lại sau.',
      );
    }
    return userDb;
  }

  async updateUserPasswordForLogin(
    id: number,
    updateUserPasswordLoginDto: UpdateUserPasswordDto,
  ) {
    const { new_password, renew_password } = updateUserPasswordLoginDto;

    const userDb = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (this.isValidPassword(new_password, userDb.password)) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }

    if (new_password !== renew_password) {
      throw new BadRequestException(
        'Mật khẩu nhập lại phải giống mật khẩu mới',
      );
    }

    return await this.userRepository.update(
      { id },
      {
        password: this.hashPassword(new_password),
        updatedBy: id,
        passwordToken: null,
      },
    );
  }

  async remove(id: number, user: IUser) {
    const userDb = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userDb) {
      throw new BadRequestException(`User ${id} does not exist`);
    }
    await this.userRepository.update(
      {
        id,
      },
      {
        deletedBy: user.id,
      },
    );
    return await this.userRepository.softDelete(id);
  }
}
