import axios, { Method } from "axios";

const headers = {
  bap: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "T7Wi2Q7tHFkq6sxU5WaUSBIGg3ynb96Qi74RnAeY6ys=",
  },
  shago: {
    "Content-Type": "application/json",
    hashKey: "c1df88d180d0163fc53f4efde6288a2c87a2ceaaefae0685fd4a8c01b217e70d",
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