
import axios, { Method } from "axios";
import { config } from "../config/constants";

const { shago_api, bap_api } = config;

const headers = {
  bap: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": bap_api,
  },
  shago: {
    "Content-Type": "application/json",
    hashKey: shago_api,
  },
};

export const makeRequest = async (
  url: string,
  method: Method,
  provider: keyof typeof headers,
  payload?: any
) => {
  try {
    const response = await axios({
      url,
      method,
      headers: headers[provider],
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
