// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from "../models/userModel";
import { Types } from "mongoose";

// utils moduels (from the project)
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { sendEmail } from "../utils/nodeMailer";
import {
  AuthForgetPasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
  UserRequest,
} from "../types/authType";

// const AppError = require("../utils/AppError");
// const catchAsync = require("../utils/catchAsync");
// const { sendEmail } = require("../utils/nodeMailer");
// const { send } = require("process");

// function for generating token for authentication
const signToken = (userId: Types.ObjectId) => {
  if (!userId) {
    throw new Error("User ID is required to sign the token");
  }

  const jwtSECRET = process.env.JWT_SECRET;
  const jwtEXPIRES = process.env.JWT_EXPIRES as SignOptions["expiresIn"];

  if (!jwtSECRET || !jwtEXPIRES) {
    throw new Error(
      "JWT_SECRET and JWT_EXPIRES must be defined in environment variables"
    );
  }

  return jwt.sign({ id: userId }, jwtSECRET, {
    expiresIn: jwtEXPIRES,
  });
};

// register the user
export const register = catchAsync(
  async (req: AuthRegisterRequest, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return next(new AppError("Please enter all the fields", 404));
    }

    // save the user in DB
    const saveUser = await User.create({ name, email, password });
    if (!saveUser) {
      return next(new AppError("User is not created", 404));
    }

    // get the token
    const token: string = signToken(saveUser._id);

    // send response to the client
    res.json({
      status: "success",
      token: token,
      data: saveUser,
    });
  }
);

// login the user
export const login = catchAsync(
  async (req: AuthLoginRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return next(new AppError("Please provide credentials", 404));
    }

    // find the user in DB
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return next(new AppError("User not found", 404));
    }

    if (!checkUser.password) {
      return next(new AppError("Password not set for this user", 404));
    }

    // validate the password
    const checkPassword: boolean = await checkUser.comparePasswords(
      password,
      checkUser.password
    );

    // return error if password does not match
    if (!checkPassword) {
      return next(new AppError("password does not match", 404));
    }

    // generate the token
    const token: string = signToken(checkUser._id);

    // send response to the client
    res.status(200).json({
      status: "success",
      token,
      message: "login successfull",
    });
  }
);

// logout the user
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      message: "logout successfull",
    });
  }
);

// forget the password
// ! must test this function
export const forgetPassword = catchAsync(
  async (req: AuthForgetPasswordRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new AppError("Please Enter your email field", 404));
    }

    // check that user is exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!user || !user.passwordResetToken || !user.passwordTokenExpires) {
      return next(
        new AppError("User not found or password reset token is invalid", 404)
      );
    }

    const resetToken: string = crypto.randomBytes(12).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordTokenExpires = String(Date.now() + 30 * 1000);

    await user.save({ validateBeforeSave: false });

    // generate the rest url
    const url = `${req.protocol}://${req.get(
      "host"
    )}/auth/resetpassword/${resetToken}`;
    const message = `click this link to change the password ${url}`;

    // sending email to client
    try {
      sendEmail({
        subject: "change your password",
        message: message,
      });
    } catch (error) {
      console.error("Error :- ", error);
    }

    // send respose to the client
    res.status(200).json({
      status: "success",
      message: "email send successfully",
    });
  }
);

// reset the password
export const resetPassword = catchAsync(
  async (req: AuthResetPasswordRequest, res: Response, next: NextFunction) => {
    const { password } = req.body;
    if (!password) {
      return next(new AppError("password not found", 404));
    }

    // if token is not found in params
    if (!req.params.token) {
      return next(new AppError("Token not found", 404));
    }

    // create hashed token based on params
    const hashedToken: string = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // find the user in DB
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!user.passwordResetToken || !user.passwordTokenExpires) {
      return next(new AppError("Password reset token is invalid", 404));
    }

    // Update the profile
    user.password = password;
    user.passwordResetToken = null;
    user.passwordTokenExpires = null;

    // save the profile
    await user.save();

    // send respose to client
    res.status(200).json({
      status: "success",
      message: "password reset successfully",
    });
  }
);

// get the profile of the user
export const getProfile = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return next(new AppError("User not found", 404));
    }

    const user = req.user.id;

    const findUser = await User.findById(user);
    if (!findUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: findUser,
    });
  }
);

// genrate the token when user is logged in via google
export const googleCallback = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return next(new AppError("User not found", 404));
    }

    const token = signToken(req.user.id);
    res.status(200).json({
      message: "Google Login successful",
      token,
      user: req.user,
    });
  }
);
