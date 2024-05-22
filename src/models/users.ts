import { sequelizeConnection, DataTypes, ModelDefined } from "../config/db";
import { UserAttributes, UserCreationAttributes } from "../types";

const user: ModelDefined<UserAttributes, UserCreationAttributes> =
  sequelizeConnection.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
      },
    },
    {
      tableName: "users",
    }
  );

export default user;
