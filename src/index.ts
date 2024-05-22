/** @format */

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { errorMiddleware } from "./middleware/error";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server works well");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
