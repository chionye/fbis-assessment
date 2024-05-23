import { NextFunction } from "express";
import { makeRequest } from "../api";
import { RequestAttribute } from "../types";

export const checkShagoBalance = async (amount: number, url: string) => {
  const data = JSON.stringify({ serviceCode: "BAL" });
  const shagoBalance = await makeRequest(url, "POST", "shago", data);
  return shagoBalance && shagoBalance.wallet.primaryBalance >= amount;
};

export const purchaseAirtimeShago = async (
  requestBody: RequestAttribute,
  url: string,
  next: NextFunction
) => {
  try {
    const purchase = await makeRequest(url, "POST", "shago", requestBody);
    if (purchase.status == 200) {
      return { purchase, status: "complete" };
    } else if (purchase.status == 400) {
      const pollInterval = 5000;
      const maxRetries = 12;
      let retries = 0;

      return new Promise<{ purchase: any; status: string }>(
        (resolve, reject) => {
          const intervalId = setInterval(async () => {
            const requeryShago = await makeRequest(url, "POST", "shago", {
              serviceCode: "QUB",
              reference: purchase.transId,
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
          }, pollInterval);
        }
      );
    } else {
      return { purchase: null, status: "incomplete" };
    }
  } catch (error: any) {
    console.log(error.message);
    return { purchase: null, status: "incomplete" };
  }
};