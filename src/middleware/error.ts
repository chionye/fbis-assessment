/** @format */

import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../helpers/ErrorHandler";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message,
    ...(err.context && { context: err.context }),
  };
  if (err.logging) {
    console.error(response);
  }
  res.status(statusCode).json(response);
};
