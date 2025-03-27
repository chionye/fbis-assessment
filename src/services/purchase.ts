
import { NextFunction } from "express";
import { RequestAttribute, payloadAttributes } from "../types";
import { purchaseAirtimeShago } from "./shago";
import { purchaseAirtimeBap } from "./bap";
import ErrorHandler from "../helpers/ErrorHandler";

import { config } from "../config/constants";

const { billers } = config;

export const airtimePurchaseSwitch: any = async (
  pointer: number,
  payload: RequestAttribute,
  next: NextFunction
): Promise<any> => {
  let purchaseData: payloadAttributes = {
    purchase: "",
    status: "incomplete",
  };
  let currentBiller: any = billers[pointer] || "none";
  switch (currentBiller) {
    case "shago":
      purchaseData = await purchaseAirtimeShago(payload, next);
      break;

    case "bap":
      purchaseData = await purchaseAirtimeBap(payload, next);
      break;

    default:
      console.log("All billers exhausted or service unavailable.");
      return next(
        new ErrorHandler({
          code: 500,
          message: "Service unavailable, please try again later",
          logging: true,
        })
      );
  }

  return purchaseData.status === "incomplete" && currentBiller !== "none"
    ? airtimePurchaseSwitch(pointer + 1, currentBiller, payload, next)
    : purchaseData;
};
