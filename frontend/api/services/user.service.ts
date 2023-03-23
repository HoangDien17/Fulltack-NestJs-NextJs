import axios from "axios";
import {
  IFormSignUp,
  IFormSignIn,
  IFormForgotPassword,
  IResetPassword
} from "../interface/form.interface";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export function signUp(body: IFormSignUp) {
  return axios.post(`${backendUrl}/auth/sign-up`, body);
}

export function signIn(body: IFormSignIn) {
  return axios.post(`${backendUrl}/auth/sign-in`, body);
}

export function forgotPassword(body: IFormForgotPassword) {
  return axios.post(`${backendUrl}/users/pre-reset-password`, body);
}

export function updatePassword(token: string, body: IResetPassword) {
  return axios.patch(`${backendUrl}/users/reset-password/${token}`, body);
}