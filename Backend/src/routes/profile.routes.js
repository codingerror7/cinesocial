import express from "express";
import { createProfile, getProfile } from "../controller/profile.controller.js";

const profileRouter = express.Router();

profileRouter.post("/create-profile",createProfile);
profileRouter.get("/get-profile/:id",getProfile);

export default profileRouter;