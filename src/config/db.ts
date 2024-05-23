/** @format */

import { Sequelize, DataTypes, ModelDefined } from "sequelize";
import { config } from "./constants";

const { host, user, password, name, pool } = config.db;

const sequelizeConnection = new Sequelize(name, user, password, {
  host: host,
  dialect: "mysql",
  pool,
});

export { sequelizeConnection, DataTypes, ModelDefined };
