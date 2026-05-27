import express from "express";
import { createCommunities, getCommunities, getJoinedCommunities, getCommunityBySlug, getCommunityMessages, postCommunityMessage, joinCommunity } from "../controller/community.controller.js";

const communityRoutes = express.Router();

communityRoutes.post("/create-community", createCommunities);
communityRoutes.get("/get-communities", getCommunities);
communityRoutes.get("/community/:slug", getCommunityBySlug);
communityRoutes.get("/community/:communityId/messages", getCommunityMessages);
communityRoutes.post("/community/:communityId/message", postCommunityMessage);
communityRoutes.post("/join-community", joinCommunity);
communityRoutes.get("/joined-communities/:id", getJoinedCommunities);

export default communityRoutes;