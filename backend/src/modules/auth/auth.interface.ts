import { IUsers } from '../users/users.interface';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUsers;
}

export interface IAuthRequest {
  email: string;
  password: string;
}
