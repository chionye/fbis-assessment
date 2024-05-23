/** @format */
import { sequelizeConnection, DataTypes, ModelDefined } from "../config/db";
import { TransactionAttributes, TransactionCreationAttributes } from "../types";

const transactions: ModelDefined<
  TransactionAttributes,
  TransactionCreationAttributes
> = sequelizeConnection.define(
  "transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    biller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction_ref: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "transactions",
  }
);

export default transactions;
