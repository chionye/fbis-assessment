/** @format */

import { Sequelize, DataTypes, ModelDefined } from "sequelize";
import { config } from "./constants";

const { host, user, password, name, driver } = config.db;

const sequelizeConnection = new Sequelize(name, user, password, {
  host: host,
  dialect: driver,
});

export {sequelizeConnection, DataTypes, ModelDefined};
