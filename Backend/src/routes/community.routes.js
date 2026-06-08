import express from "express";
import {
  createCommunities,
  getCommunities,
  getJoinedCommunities,
  getCommunityBySlug,
  joinCommunity,
  getCommunityMessages,
} from "../controller/community.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const communityRoutes = express.Router();

communityRoutes.post("/create-community", authMiddleware, createCommunities);
communityRoutes.post("/join-community", authMiddleware, joinCommunity);
communityRoutes.get("/community-messages/:communityId", authMiddleware, getCommunityMessages);
communityRoutes.get("/get-communities", authMiddleware, getCommunities);
communityRoutes.get("/joined-communities/:id", getJoinedCommunities);
communityRoutes.get("/get-community/:slug", getCommunityBySlug);

export default communityRoutes;