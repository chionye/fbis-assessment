import { CustomErrorContent } from "../types";

export default class ErrorHandler extends Error {
  public statusCode: number;
  public logging: boolean;
  public context: { [key: string]: any };

  constructor(params: {
    code: number;
    message: string;
    logging?: boolean;
    context?: { [key: string]: any };
  }) {
    super(params.message);
    this.statusCode = params.code;
    this.logging = params.logging || false;
    this.context = params.context || {};

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

