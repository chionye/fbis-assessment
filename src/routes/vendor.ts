/** @format */

import express, { Router } from "express";
import { purchaseAirtime } from "../controllers/vendor";

const vendorRouter: Router = express.Router();

vendorRouter.post("/purchase/:id", purchaseAirtime);

export default vendorRouter;
