import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetUserByEmailAndPasswordTokenDto } from './dto/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.userService.create(createUserDto, user);
  }

  @Get()
  findAll(@Paginate() path: PaginateQuery, @Query() qs: string) {
    return this.userService.findAll(path, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.userService.update(+id, updateUserDto, user);
  }

  @Patch('/update-profile/:id')
  @ResponseMessage('Update user profile')
  updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @User() user: IUser,
  ) {
    return this.userService.updateUserProfile(+id, updateUserProfileDto, user);
  }

  @Patch('/change-password/:id')
  @ResponseMessage('Update user password')
  updateUserPassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @User() user: IUser,
  ) {
    return this.userService.updateUserPassword(
      +id,
      updateUserPasswordDto,
      user,
    );
  }

  @Public()
  @Post('/get-user-by-email-and-password-token')
  @ResponseMessage('Get user by email and password token')
  getUserEmailAndPasswordToken(
    @Body()
    getUserByEmailAndPasswordTokenDto: GetUserByEmailAndPasswordTokenDto,
  ) {
    return this.userService.getUserEmailAndPasswordToken(
      getUserByEmailAndPasswordTokenDto,
    );
  }

  @Public()
  @Patch('/change-password-for-login/:id')
  @ResponseMessage('Update user password')
  updateUserPasswordForLogin(
    @Param('id') id: string,
    @Body() updateUserPasswordLoginDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPasswordForLogin(
      +id,
      updateUserPasswordLoginDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.userService.remove(+id, user);
  }
}
