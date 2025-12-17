export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  endpoint: string;
  method: string;
  module: string;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  birthDay: Date;
  phone: string;
  gender?: string;
  avatar?: string;
  role: Role;
  permissions: Permission[];
}
