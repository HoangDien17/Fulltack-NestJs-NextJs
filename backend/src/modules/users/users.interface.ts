import { USER_STATUS } from '../../utils/enum';
export interface IUsers {
  id: number;
  first_name: string;
  last_name: string;
  password?: string;
  email: string;
  is_active: number;
  register_token?: string;
  confirm_email_at?: Date;
  reset_password_at?: Date;
  reset_password_token?: string;
  attack_count?: number;
  lock_time?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  register_token?: string;
}

export interface IResetPassword {
  password: string;
  rePassword: string;
}

export interface IConfirmRegister {
  token: string;
}

export interface IUserLog {
  id?: number;
  ip: string;
  is_error: number;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}
