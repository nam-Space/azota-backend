import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  birthDay: Date;

  @IsOptional()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  gender: string;

  @IsOptional()
  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  roleId: number;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  password: string;

  @IsNotEmpty({
    message: 'Gender không được để trống',
  })
  gender: string;
}
