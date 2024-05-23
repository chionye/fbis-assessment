/** @format */

import express, { Express, Request, Response } from "express";
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/users";
import vendorRouter from "./routes/vendor";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Express = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10000,
});

app.use(limiter);

app.use(helmet());

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "200mb",
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("api/v1/", (req: Request, res: Response) => {
  res.send("Server works well");
});

app.use("api/v1/user", userRouter);

app.use("api/v1/airtime", vendorRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
