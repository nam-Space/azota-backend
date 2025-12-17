import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/user/user.interface';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private roleService: RoleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { id, email, name, birthDay, phone, gender, avatar, role } = payload;

    const roleDb = await this.roleService.findOne(role.id);
    const permissions = roleDb.rolePermissions.map((rolePermission) => {
      return {
        id: rolePermission.permission.id,
        name: rolePermission.permission.name,
        endpoint: rolePermission.permission.endpoint,
        method: rolePermission.permission.method,
        module: rolePermission.permission.module,
      };
    });

    return {
      id,
      email,
      name,
      birthDay,
      phone,
      gender,
      avatar,
      role,
      permissions,
    };
  }
}
