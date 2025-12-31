// const jwt = require("jsonwebtoken");

// const User = require("../models/userModel");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/AppError");

import jwt from "jsonwebtoken";

import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// types
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  id: string;
}

// create a protect route
export const protectRoutes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token) {
      return next(new AppError("Token not found", 404));
    }

    if (token && token.startsWith("Bearer ")) {
      // get the first token after Bearer
      token = token.split("Bearer ")[1];

      // validations
      if (!token) {
        return next(new AppError("Token not found", 404));
      }

      if (!process.env.JWT_SECRET) {
        return next(new AppError("JWT_SECRET is not defined", 500));
      }

      // decode the jwt token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;

      if (!decoded || !decoded.id) {
        return next(new AppError("Invalid token", 401));
      }

      // find the user by using token in db
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      req.user = user;
    }

    next();
  }
);
