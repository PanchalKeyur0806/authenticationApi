import { Request, Response, NextFunction } from "express";
export const errController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  const { message } = err;

  res.status(400).json({
    status: "Error",
    message: message,
  });
};
