/** @format */

import { Optional } from "sequelize";

export type DBProp = {
  [key: string]: any;
};

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  balance?: string;
}

export type UserCreationAttributes = Optional<UserAttributes, "id" | "balance">;

export interface TransactionAttributes {
  id: number;
  user_id: number;
  network: string;
  amount: number;
  transaction_ref: string;
}

export type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id"
>;
