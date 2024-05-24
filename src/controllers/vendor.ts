/** @format */

import { NextFunction, Response, Request } from "express";
import { makeRequest } from "../api";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";
import { checkUserBalance, update } from "../dal";
import { airtimePurchaseSwitch } from "../services/purchase";

export const purchaseAirtime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Check user balance
    await checkUserBalance(id, payload, res, next);
    //purchase airtime
    const purchase = await airtimePurchaseSwitch(0, payload, next);

    if (purchase.status === "complete") {
      const result = await update(id, purchase.data, next);
      if (result) {
        const { biller, ...responseData } = purchase.data;
        return customResponse(
          res,
          `Airtime purchased successfully`,
          responseData
        );
      }
    } else {
      return next(
        new ErrorHandler({
          code: 500,
          message: "Service unavailable, please try again later",
          logging: true,
        })
      );
    }
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
