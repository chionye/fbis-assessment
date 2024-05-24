/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import { RequestAttribute } from "../types";
import { config } from "../config/constants";

const { bap_url } = config;

export const checkBapBalance = async (amount: number) => {
  const bapBalance = await makeRequest(
    `${bap_url}/superagent/account/balance`,
    "GET",
    "bap"
  );
  return bapBalance && bapBalance.data.balance >= amount;
};

export const purchaseAirtimeBap = async (
  requestBody: RequestAttribute,
  next: NextFunction
) => {
  try {
    const { amount } = requestBody;
    const bapBalance = await checkBapBalance(amount);
    if (bapBalance) {
      const bapRequestBody: RequestAttribute = {
        phone: requestBody.phone,
        amount: amount,
        service_type: requestBody.network_provider.toLowerCase(),
        plan: "prepaid",
        agentId: "205",
        agentReference: Date.now().toString(),
      };
      const purchase = await makeRequest(
        `${bap_url}/airtime/request`,
        "POST",
        "bap",
        bapRequestBody
      );
      if (purchase.code == 200) {
        const transactionData = {
          network: requestBody.network_provider.toUpperCase(),
          amount: amount,
          ref: purchase.data.transactionReference,
          biller: "bap",
        };
        return { purchase, status: "complete", data: transactionData };
      } else {
        return { purchase: null, status: "incomplete" };
      }
    } else {
      return {
        purchase: null,
        status: "incomplete",
        reason: "insufficient funds on bap account",
      };
    }
  } catch (error: any) {
    console.log(error.message);
    return { purchase: null, status: "incomplete" };
  }
};
