import express, { Router } from "express";
import { createUser, updateUser } from "../controllers/users";

const userRouter: Router = express.Router();

userRouter.post("/register", createUser);

userRouter.patch("/:id", updateUser);

export default userRouter;