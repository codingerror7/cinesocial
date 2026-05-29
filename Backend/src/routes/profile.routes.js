import express from "express";
import { createProfile, getProfile } from "../controller/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const profileRouter = express.Router();

profileRouter.post("/create-profile",createProfile);
profileRouter.get("/get-profile/:id",authMiddleware,getProfile);

export default profileRouter;