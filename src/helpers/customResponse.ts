/** @format */

import { Response } from "express";

export const customResponse = (
  res: Response,
  message: string = "",
  data?: any,
) => {
  const response = {
    status: 200,
    success: true,
    message,
    data,
  };

  return res.status(200).json(response);
};