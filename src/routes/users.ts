import express, { Router } from "express";
import { createUser } from "../controllers/users";

const userRouter: Router = express.Router();

userRouter.post("/register", createUser);

export default userRouter;