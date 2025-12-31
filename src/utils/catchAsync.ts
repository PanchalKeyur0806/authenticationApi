import { NextFunction, Request, Response, RequestHandler } from "express";
import { AsyncHandler } from "../types/authType";

const catchAsync = (func: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    func(req as Parameters<AsyncHandler>[0], res, next).catch(next);
  };
};

// module.exports = catchAsync;
export default catchAsync;
