import { NextFunction, Response, Request } from "express";
import { create, update } from "../dal/users";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  create(payload, res, next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { id } = req.params;
  update(id, payload, res, next);
};