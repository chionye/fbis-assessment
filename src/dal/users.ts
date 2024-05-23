/** @format */

import { NextFunction, Request, Response } from "express";
import { user, transactions } from "../models";
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
  payload: any,
  next: NextFunction
) => {
  const transaction = await sequelizeConnection.transaction();
  try {
    const findUser: any = await user.findByPk(id, { transaction });
    if (!findUser || findUser.balance < payload.amount) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "Insufficient balance",
          logging: true,
        })
      );
    }

    const remaininigBalance = findUser.balance - payload.amount;
    console.log(remaininigBalance, id);
    await user.update(
      { balance: remaininigBalance },
      {
        where: {
          id,
        },
      }
    );
    console.log(payload);

    await transactions.create(
      {
        user_id: parseInt(id),
        network: payload.network,
        amount: payload.amount,
        transaction_ref: payload.ref,
        biller: payload.biller
      },
      { transaction }
    );

    await transaction.commit();

    return true;
  } catch (error: any) {
    await transaction.rollback();

    return next(
      new ErrorHandler({
        code: 500,
        message: error.message,
        logging: true,
      })
    );
  }
};

export const checkUserBalance = async (
  id: string,
  payload: any,
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

    const userBalance = foundUser.dataValues.balance;
    if (typeof userBalance !== "number" || userBalance < payload.amount) {
      return next(
        new ErrorHandler({
          code: 400,
          message: "Insufficient balance",
          logging: true,
        })
      );
    }

    return foundUser;
  } catch (error: any) {
    return next(
      new ErrorHandler({ code: 500, message: error.message, logging: true })
    );
  }
};
