/** @format */

import { NextFunction, Response, Request } from "express";
import { makeRequest } from "../api";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";
import { checkUserBalance, update } from "../dal/users";
import { RequestAttribute } from "../types";
import { billerURL, handleBapPurchase } from "../helpers/functions";

export const purchaseAirtime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Check user balance
    const user = await checkUserBalance(id, payload, res, next);
    if (!user) return;

    const amount = parseInt(payload.amount);
    const data = JSON.stringify({ serviceCode: "BAL" });

    let biller: "bap" | "shago" = "shago";
    let shagoBalance, bapBalance;

    // Check shago balance
    shagoBalance = await makeRequest(
      "http://test.shagopayments.com/public/api/test/b2b",
      "POST",
      "shago",
      data
    );

    if (!shagoBalance || shagoBalance.wallet.primaryBalance < amount) {
      // Check bap balance if shago balance is insufficient
      bapBalance = await makeRequest(
        "https://api.staging.baxibap.com/services/superagent/account/balance",
        "GET",
        "bap"
      );
      biller = "bap";

      if (!bapBalance || bapBalance.data.balance < amount) {
        return next(
          new ErrorHandler({
            code: 500,
            message: "please fund your shago or bap accounts to continue",
            logging: true,
          })
        );
      }
    }

    // Prepare request body
    const shagoRequestBody: RequestAttribute = {
      serviceCode: "QAB",
      phone: payload.phone,
      amount: amount.toString(),
      vend_type: "VTU",
      network: payload.network_provider.toUpperCase(),
      request_id: Date.now().toString(),
    };

    const bapRequestBody: RequestAttribute = {
      phone: payload.phone,
      amount: amount,
      service_type: payload.network_provider.toLowerCase(),
      plan: "prepaid",
      agentId: "205",
      agentReference: Date.now().toString(),
    };

    let airtimeData: { purchase: any; status: string } = {
      purchase: "",
      status: "incomplete",
    };

    // Make purchase request
    const purchase = await makeRequest(
      billerURL(biller),
      "POST",
      biller,
      shagoRequestBody
    );

    if (biller === "shago") {
      if (purchase.status === 200) {
        airtimeData.purchase = purchase;
        airtimeData.status = "complete";
      } else if (purchase.status === 400) {
        console.log("test");
        const pollInterval = 5000;
        const maxRetries = 12;
        let retries = 0;

        const intervalId = setInterval(async () => {
          const requeryShago = await makeRequest(
            billerURL(biller),
            "POST",
            biller,
            {
              serviceCode: "QUB",
              reference: purchase.transId,
            }
          );

          retries++;

          if (requeryShago.status === 200 || retries >= maxRetries) {
            clearInterval(intervalId);
            if (requeryShago.status === 200) {
              airtimeData.purchase = requeryShago;
              airtimeData.status = "complete";
            } else {
              biller = "bap";
              const bapPurchase: any = await handleBapPurchase(
                billerURL(biller),
                biller,
                bapRequestBody,
                next
              );
              airtimeData.purchase = bapPurchase.purchase;
              airtimeData.status = bapPurchase.status;
            }
          }
        }, pollInterval);
      } else {
        biller = "bap";
        const bapPurchase: any = await handleBapPurchase(
          billerURL(biller),
          biller,
          bapRequestBody,
          next
        );
        airtimeData.purchase = bapPurchase.purchase;
        airtimeData.status = bapPurchase.status;
      }
    } else {
      const bapPurchase: any = await handleBapPurchase(
        billerURL(biller),
        biller,
        bapRequestBody,
        next
      );
      airtimeData.purchase = bapPurchase.purchase;
      airtimeData.status = bapPurchase.status;
    }

    console.log(airtimeData, biller);
    if (airtimeData.status === "complete") {
      const transactionData = {
        network: payload.network_provider.toUpperCase(),
        amount: payload.amount,
        ref:
          airtimeData.purchase.transId ||
          airtimeData.purchase.data.transactionReference,
        biller,
      };
      const result = await update(id, transactionData, next);
      if (result) {
        return customResponse(
          res,
          "airtime purchased successfully",
          airtimeData.purchase
        );
      }
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
