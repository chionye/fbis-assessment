/** @format */

import { Sequelize, DataTypes, ModelDefined } from "sequelize";
import { config } from "./constants";

const { host, user, password, name, pool } = config.db;

const sequelizeConnection = new Sequelize(
  "fbis_airtime_vendor_db",
  "root",
  "",
  {
    host: host,
    dialect: "mysql",
    pool,
  }
);

export { sequelizeConnection, DataTypes, ModelDefined };
