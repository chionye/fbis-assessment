/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import { RequestAttribute, payloadAttributes } from "../types";
import { config } from "../config/constants";
import ErrorHandler from "../helpers/ErrorHandler";

const { shago_url } = config;

const checkShagoBalance = async (amount: number): Promise<boolean> => {
  const data = JSON.stringify({ serviceCode: "BAL" });
  const shagoBalance = await makeRequest(shago_url, "POST", "shago", data);
  return shagoBalance && shagoBalance.wallet.primaryBalance >= amount;
};

const requeryShagoTransaction = async (
  transId: string,
  pollInterval: number,
  maxRetries: number
): Promise<payloadAttributes> => {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const intervalId = setInterval(async () => {
      try {
        const requeryShago = await makeRequest(shago_url, "POST", "shago", {
          serviceCode: "QUB",
          reference: transId,
        });

        retries++;

        if (requeryShago.status == 200 || retries >= maxRetries) {
          clearInterval(intervalId);
          if (requeryShago.status == 200) {
            resolve({ purchase: requeryShago, status: "complete" });
          } else {
            resolve({ purchase: null, status: "incomplete" });
          }
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    }, pollInterval);
  });
};

export const purchaseAirtimeShago = async (
  requestBody: RequestAttribute,
  next: NextFunction
): Promise<payloadAttributes> => {
  try {
    const { amount } = requestBody;
    const shagoBalance = await checkShagoBalance(amount);

    if (!shagoBalance) {
      return {
        purchase: null,
        status: "incomplete",
        reason: "insufficient funds on shago account",
      };
    }

    const shagoRequestBody: RequestAttribute = {
      serviceCode: "QAB",
      phone: requestBody.phone,
      amount: requestBody.amount.toString(),
      vend_type: "VTU",
      network: requestBody.network_provider.toUpperCase(),
      request_id: Date.now().toString(),
    };

    const purchase = await makeRequest(
      shago_url,
      "POST",
      "shago",
      shagoRequestBody
    );

    if (purchase.status == 200) {
      const transactionData = {
        network: requestBody.network_provider.toUpperCase(),
        amount: amount,
        ref: purchase.transId,
        biller: "shago",
      };
      return { purchase, status: "complete", data: transactionData };
    }

    if (purchase.status == 400) {
      return await requeryShagoTransaction(purchase.transId, 5000, 12);
    }

    return { purchase: null, status: "incomplete" };
  } catch (error: any) {
    console.error(error.message);
    return { purchase: null, status: "incomplete" };
  }
};