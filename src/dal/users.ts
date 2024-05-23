/** @format */

import { NextFunction, Request, Response } from "express";
import { user } from "../models";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";
import { UserAttributes } from "../types";
import { sequelizeConnection } from "../config/db";

export const create = async (
  payload: UserAttributes,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await user.findOne({ where: { email: payload.email } });

    if (foundUser) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "User already exists",
          logging: true,
        })
      );
    }
    const result = sequelizeConnection.transaction(async (t) => {
      const newUser = await user.create(payload, { transaction: t });
      return newUser;
    });

    if (!result) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "User not created",
          logging: true,
        })
      );
    }

    return customResponse(res, "User created successfully", result);
  } catch (error: any) {
    return next(
      new ErrorHandler({ code: 500, message: error.message, logging: true })
    );
  }
};

export const update = async (
  id: string,
  payload: UserAttributes,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await user.findByPk(id);

    if (!foundUser) {
      return next(
        new ErrorHandler({
          code: 404,
          message: "User not found",
          logging: true,
        })
      );
    }
    const result = sequelizeConnection.transaction(async (t) => {
      const [updated] = await user.update(payload, {
        where: { id },
        transaction: t,
      });
      return updated;
    });

    if (!result) {
      return next(
        new ErrorHandler({
          code: 500,
          message: "User not updated",
          logging: true,
        })
      );
    }

    return customResponse(res, "User updated successfully");
  } catch (error: any) {
    return next(
      new ErrorHandler({ code: 500, message: error.message, logging: true })
    );
  }
};

export const checkUserBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const foundUser: any = await user.findByPk(id);

    if (!foundUser) {
      return next(
        new ErrorHandler({
          code: 404,
          message: "User not found",
          logging: true,
        })
      );
    }

    if (foundUser.balance < payload.amount) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "Insufficient balance",
          logging: true,
        })
      );
    }

    return customResponse(res, "Balance retrieved successfully", {
      balance: foundUser?.balance,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler({ code: 500, message: error.message, logging: true })
    );
  }
};
