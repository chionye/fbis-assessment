import { Dialect } from "sequelize";

const {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_DRIVER,
  BAP_API_KEY,
  SHAGGO_API_KEY,
} = process.env;

export const config = {
  port: PORT,
  db: {
    host: DB_HOST,
    name: DB_NAME as string,
    user: DB_USER as string,
    password: DB_PASS,
    driver: DB_DRIVER as Dialect,
  },
  bap_api: BAP_API_KEY,
  shaggo_api: SHAGGO_API_KEY,
};
