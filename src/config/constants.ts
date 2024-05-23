/** @format */

const {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_DRIVER,
  BAP_API_KEY,
  SHAGO_API_KEY,
} = process.env;

export const config = {
  port: PORT,
  db: {
    host: DB_HOST,
    name: DB_NAME as string,
    user: DB_USER as string,
    password: DB_PASS as string,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  bap_api: BAP_API_KEY,
  shago_api: SHAGO_API_KEY,
};
