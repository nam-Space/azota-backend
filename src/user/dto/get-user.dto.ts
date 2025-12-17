import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserByEmailAndPasswordTokenDto {
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
    message: 'tokenPassword không được để trống',
  })
  passwordToken: string;
}
