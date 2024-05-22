import { NextFunction, Request, Response } from "express";
import { user } from "../models";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
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

    const newUser = await user.create(payload);

    if (!newUser) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "User not created",
          logging: true,
        })
      );
    }

    return customResponse(res, "User created successfully", newUser);
  } catch (error: any) {
    return next(
      new ErrorHandler({ code: 500, message: error.message, logging: true })
    );
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { id } = req.params;
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

    const [updated] = await user.update(payload, { where: { id } });

    if (!updated) {
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
