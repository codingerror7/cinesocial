import express from "express";
import { createCommunities, getCommunities, getJoinedCommunities} from "../controller/community.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const communityRoutes = express.Router();

communityRoutes.post("/create-community", createCommunities);
communityRoutes.get("/get-communities",authMiddleware, getCommunities);
communityRoutes.get("/joined-communities/:id", getJoinedCommunities);

export default communityRoutes;