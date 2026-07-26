import express from "express";
import { signUp,logIn,refresh,logOut, deleteAccount } from "../controller/auth.controller.js";
import authrateLimit from "../middlewares/authRateLimiter.middlewares.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup",authrateLimit,signUp);
authRouter.post("/login",authrateLimit,logIn);
authRouter.post("/refresh",refresh);
authRouter.post("/logout",logOut);
authRouter.delete("/delete-account/:id", authMiddleware, deleteAccount);

export default authRouter;