/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import ErrorHandler from "./ErrorHandler";
import { config } from "../config/constants";

export const billerURL = (biller: string) => {
  const { shago_url, bap_url } = config;
  return biller === "shago" ? shago_url : `${bap_url}/airtime/request`;
};

export const handleBapPurchase = async (
  url: string,
  biller: string,
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
