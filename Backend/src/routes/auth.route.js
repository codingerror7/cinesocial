import express from "express";
import { signUp,logIn,refresh,logOut, deleteAccount } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup",signUp);
authRouter.post("/login",logIn);
authRouter.post("/refresh",refresh);
authRouter.post("/logout",logOut);
authRouter.delete("/delete-account/:id", deleteAccount);

export default authRouter;