import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { IUser } from 'src/user/user.interface';
import { Request as RequestExpress, Response } from 'express';
import { RoleService } from 'src/role/role.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('/register')
  async handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/account')
  @ResponseMessage('Get user information')
  async handleGetAccount(@User() user: IUser) {
    const role = await this.roleService.findOne(user.role.id);
    const permissions = role.rolePermissions.map((rolePermission) => {
      return {
        id: rolePermission.permission.id,
        name: rolePermission.permission.name,
        endpoint: rolePermission.permission.endpoint,
        method: rolePermission.permission.method,
        module: rolePermission.permission.module,
      };
    });
    user.permissions = permissions;
    return { user };
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get user by refresh token')
  handleRefreshToken(
    @Req() request: RequestExpress,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout user')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
