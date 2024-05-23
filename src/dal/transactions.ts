/** @format */

import { transactions } from "../models";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { sequelizeConnection } from "../config/db";

export const createNewTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const foundTransaction = await transactions.findOne({
      where: {
        transaction_ref: payload.transaction_ref,
      },
    });
    if (foundTransaction) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "transaction already exists",
          logging: true,
        })
      );
    }
    const result = sequelizeConnection.transaction(async (t) => {
      const newTransaction: any = await transactions.create(payload, {
        transaction: t,
      });
      return newTransaction;
    });

    if (!result) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "transaction not created",
          logging: true,
        })
      );
    }
    return customResponse(res, "transaction updated successfully", result);
  } catch (error: any) {
    return next(
      new ErrorHandler({
        code: 500,
        message: error.message,
        logging: true,
      })
    );
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const foundTransaction = await transactions.findByPk(id);
    if (!foundTransaction) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "transaction not found",
          logging: true,
        })
      );
    }
    const result = sequelizeConnection.transaction(async (t) => {
      const [updatedTransaction] = await transactions.update(payload, {
        where: { id },
        transaction: t,
      });
      return updatedTransaction;
    });
    if (!result) {
      return next(
        new ErrorHandler({
          code: 500,
          message: "transaction not updated",
          logging: true,
        })
      );
    }
    return result;
  } catch (error: any) {
    return next(
      new ErrorHandler({
        code: 500,
        message: error.message,
        logging: true,
      })
    );
  }
};