/** @format */

import { NextFunction, Response, Request } from "express";
import { create } from "../dal";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  create(payload, res, next);
};
