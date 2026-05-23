import express from "express";
import { createCommunities, getCommunities, getJoinedCommunities, joinCommunity } from "../controller/community.controller.js";

const communityRoutes = express.Router();

communityRoutes.post("/create-community", createCommunities);
communityRoutes.get("/get-communities", getCommunities);
communityRoutes.post("/join-community", joinCommunity);
communityRoutes.get("/joined-communities/:id", getJoinedCommunities);

export default communityRoutes;