/** @format */

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { sequelizeConnection } from "./config/db";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server works well");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
