/** @format */

import { Optional } from "sequelize";

export type RequestAttribute = {
  [key: string]: string | number
};

export type UserAttributes = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  balance?: number;
}

export type UserCreationAttributes = Optional<UserAttributes, "id" | "balance">;

export interface TransactionAttributes {
  id: number;
  user_id: number;
  network: string;
  amount: number;
  transaction_ref: string;
  biller: string;
}

export type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id"
>;

export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: any };
};

export type RequestPayload = {
  phone: string;
  amount: number;
  service_type: string;
  plan: string;
  agentId: string;
  agentReference: string;
}