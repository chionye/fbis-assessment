/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import { RequestAttribute } from "../types";
import { billerURL } from "../helpers/functions";

export const checkBapBalance = async (amount: number, url: string) => {
  const bapBalance = await makeRequest(
    `${url}/superagent/account/balance`,
    "GET",
    "bap"
  );
  return bapBalance && bapBalance.data.balance >= amount;
};

export const purchaseAirtimeBap = async (
  requestBody: RequestAttribute,
  url: string,
  next: NextFunction
) => {
  try {
    const purchase = await makeRequest(url, "POST", "bap", requestBody);
    console.log(purchase);
    if (purchase.code == 200) {
      return { purchase, status: "complete" };
    } else {
      return { purchase: null, status: "incomplete" };
    }
  } catch (error: any) {
    console.log(error.message);
    return { purchase: null, status: "incomplete" };
  }
};
