import express from "express";
import signUp from "../controller/auth.controller.js";
import logIn from "../controller/auth.controller.js";
import logOut from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup",signUp);
authRouter.post("/login",logIn);
authRouter.post("/logout",logOut);

export default authRouter;