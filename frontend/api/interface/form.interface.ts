export interface IFormSignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IFormSignIn {
  email: string;
  password: string;
}

export interface IFormForgotPassword {
  email: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}
