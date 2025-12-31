import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export interface AuthBody {
  name: string;
  email: string;
  password: string;
}

export interface AuthRegisterRequest extends Request {
  body: AuthBody;
}

export interface AuthLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface AuthForgetPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface AuthResetPasswordRequest extends Request {
  body: {
    password: string;
  };
}

export type AsyncHandler = (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordTokenExpires?: string;
  googleId?: string;
  id?: Types.ObjectId;
  _id?: string;

  // comparePasswords(
  //   userPassword: string,
  //   candidatePassword: string
  // ): Promise<boolean>;
}

export interface UserRequest extends Request {
  user?: IUser;
}
