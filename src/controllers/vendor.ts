/** @format */

import { NextFunction, Response, Request } from "express";
import { makeRequest } from "../api";
import { customResponse } from "../helpers/customResponse";
import ErrorHandler from "../helpers/ErrorHandler";
import { checkUserBalance, update } from "../dal";
import { RequestAttribute, billerAttributes } from "../types";
import { config } from "../config/constants";
import { checkShagoBalance, purchaseAirtimeShago } from "../services/shago";
import { checkBapBalance, purchaseAirtimeBap } from "../services/bap";

export const purchaseAirtime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { shago_url, bap_url } = config;

    // Check user balance
    const user = await checkUserBalance(id, payload, res, next);
    if (!user) return;

    const amount = parseInt(payload.amount);

    let biller: billerAttributes = "shago";
    let balanceCheck: boolean;

    // Check Shago balance
    balanceCheck = await checkShagoBalance(amount, shago_url);

    if (!balanceCheck) {
      // Check BAP balance if Shago balance is insufficient
      balanceCheck = await checkBapBalance(amount, bap_url);
      biller = "bap";

      if (!balanceCheck) {
        return next(
          new ErrorHandler({
            code: 500,
            message: "please fund your shago or bap accounts to continue",
            logging: true,
          })
        );
      }
    }

    // Prepare request body for Shago and BAP
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

    let purchaseData: { purchase: any; status: string } = {
      purchase: "",
      status: "incomplete",
    };

    if (biller === "shago") {
      purchaseData = await purchaseAirtimeShago(
        shagoRequestBody,
        shago_url,
        next
      );

      if (purchaseData.status !== "complete") {
        biller = "bap";
        purchaseData = await purchaseAirtimeBap(
          bapRequestBody,
          `${bap_url}/airtime/request`,
          next
        );
      }
    } else {
      purchaseData = await purchaseAirtimeBap(
        bapRequestBody,
        `${bap_url}/airtime/request`,
        next
      );
    }

    if (purchaseData.status === "complete") {
      const transactionData = {
        network: payload.network_provider.toUpperCase(),
        amount: payload.amount,
        ref:
          purchaseData.purchase.transId ||
          purchaseData.purchase.data.transactionReference,
        biller,
      };
      const result = await update(id, transactionData, next);
      if (result) {
        return customResponse(
          res,
          "airtime purchased successfully",
          purchaseData.purchase
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
