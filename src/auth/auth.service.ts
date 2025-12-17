import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { IUser } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(email);
    if (user) {
      const isValid = this.userService.isValidPassword(pass, user.password);
      if (isValid) {
        const permissions = user.role.rolePermissions?.map((rolePermission) => {
          return {
            id: rolePermission?.permission?.id,
            name: rolePermission?.permission?.name,
            endpoint: rolePermission?.permission?.endpoint,
            method: rolePermission?.permission?.method,
            module: rolePermission?.permission?.module,
          };
        });

        return {
          ...user,
          role: {
            id: user.role.id,
            name: user.role.name,
          },
          permissions,
        };
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const {
      id,
      email,
      name,
      birthDay,
      phone,
      gender,
      avatar,
      role,
      permissions,
    } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      email,
      name,
      birthDay,
      phone,
      gender,
      avatar,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    await this.userService.updateUserToken(refresh_token, id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        id,
        email,
        name,
        birthDay,
        phone,
        gender,
        avatar,
        role,
        permissions,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.userService.register(registerUserDto);
    return { ...newUser };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });

    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      const userDecode = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      if (userDecode) {
        const user = await this.userService.findOne(userDecode.id);
        if (user) {
          const { id, email, name, birthDay, phone, gender, avatar, role } =
            user;

          const payload = {
            sub: 'token refresh',
            iss: 'from server',
            id,
            email,
            name,
            birthDay,
            phone,
            gender,
            avatar,
            role: {
              id: role.id,
              name: role.name,
            },
          };

          const refresh_token = this.createRefreshToken(payload);

          await this.userService.updateUserToken(refresh_token, id);

          response.clearCookie('refresh_token');
          response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
          });

          const permissions = user.role.rolePermissions?.map(
            (rolePermission) => {
              return {
                id: rolePermission?.permission?.id,
                name: rolePermission?.permission?.name,
                endpoint: rolePermission?.permission?.endpoint,
                method: rolePermission?.permission?.method,
                module: rolePermission?.permission?.module,
              };
            },
          );

          return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            user: {
              id,
              email,
              name,
              birthDay,
              phone,
              gender,
              avatar,
              role,
              permissions,
            },
          };
        } else {
          throw new BadRequestException(
            'Refresh token không hợp lệ. Vui lòng login',
          );
        }
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ. Vui lòng login',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh token không hợp lệ. Vui lòng login',
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.userService.updateUserToken('', user.id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
