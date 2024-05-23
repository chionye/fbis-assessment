/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import ErrorHandler from "./ErrorHandler";

export const billerURL = (biller: "shago" | "bap") => {
  return biller === "shago"
    ? "http://test.shagopayments.com/public/api/test/b2b"
    : "https://api.staging.baxibap.com/services/airtime/request";
};

export const handleBapPurchase = async (
  url: string,
  biller: "bap" | "shago",
  requestBody: any,
  next: NextFunction
) => {
  const purchaseBap = await makeRequest(url, "POST", biller, requestBody);

  if (purchaseBap.code !== 200) {
    return next(
      new ErrorHandler({
        code: 500,
        message: purchaseBap.message,
        logging: true,
      })
    );
  }
  return { purchase: purchaseBap, status: "complete" };
};
