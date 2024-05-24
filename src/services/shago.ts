/** @format */

import { NextFunction } from "express";
import { makeRequest } from "../api";
import { RequestAttribute } from "../types";
import { config } from "../config/constants";

const { shago_url } = config;

export const checkShagoBalance = async (amount: number) => {
  const data = JSON.stringify({ serviceCode: "BAL" });
  const shagoBalance = await makeRequest(shago_url, "POST", "shago", data);
  return shagoBalance && shagoBalance.wallet.primaryBalance >= amount;
};

export const purchaseAirtimeShago = async (
  requestBody: RequestAttribute,
  next: NextFunction
) => {
  try {
    const { amount } = requestBody;
    const shagoBalance = await checkShagoBalance(amount);
    if (shagoBalance) {
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
        console.log(transactionData);
        return { purchase, status: "complete", data: transactionData };
      } else if (purchase.status == 400) {
        const pollInterval = 5000;
        const maxRetries = 12;
        let retries = 0;

        return new Promise<{ purchase: any; status: string }>(
          (resolve, reject) => {
            const intervalId = setInterval(async () => {
              const requeryShago = await makeRequest(
                shago_url,
                "POST",
                "shago",
                {
                  serviceCode: "QUB",
                  reference: purchase.transId,
                }
              );

              retries++;

              if (requeryShago.status == 200 || retries >= maxRetries) {
                clearInterval(intervalId);
                if (requeryShago.status == 200) {
                  resolve({ purchase: requeryShago, status: "complete" });
                } else {
                  resolve({ purchase: null, status: "incomplete" });
                }
              }
            }, pollInterval);
          }
        );
      } else {
        return { purchase: null, status: "incomplete" };
      }
    } else {
      return {
        purchase: null,
        status: "incomplete",
        reason: "insufficient funds on shago account",
      };
    }
  } catch (error: any) {
    console.log(error.message);
    return { purchase: null, status: "incomplete" };
  }
};
