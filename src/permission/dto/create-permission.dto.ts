import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  endpoint: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  module: string;
}
