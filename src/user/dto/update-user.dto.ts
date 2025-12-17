import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}

export class UpdateUserProfileDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Avatar không được để trống' })
  avatar: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'BirthDay không được để trống',
  })
  birthDay: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'Phone không được để trống',
  })
  phone: string;

  @IsNotEmpty({
    message: 'Gender không được để trống',
  })
  gender: string;
}

export class UpdateUserPasswordDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  password: string;

  @IsNotEmpty({
    message: 'Mật khẩu mới không được để trống',
  })
  new_password: string;

  @IsNotEmpty({
    message: 'Mật khẩu nhập lại không được để trống',
  })
  renew_password: string;
}
