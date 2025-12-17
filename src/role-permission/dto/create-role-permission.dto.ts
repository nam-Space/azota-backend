import { IsNotEmpty } from 'class-validator';

export class CreateRolePermissionDto {
  @IsNotEmpty()
  roleId: number;

  @IsNotEmpty()
  permissionId: number;
}
