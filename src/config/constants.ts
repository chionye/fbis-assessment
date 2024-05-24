import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  BAP_API_KEY,
  SHAGO_API_KEY,
  SHAGO_URL,
  BAP_URL
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
  bap_url: BAP_URL || "https://api.staging.baxibap.com/services",
  shago_url: SHAGO_URL || "http://test.shagopayments.com/public/api/test/b2b",
  billers: ["shago", "bap"]
};