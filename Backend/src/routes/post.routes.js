import express from "express";
import upload from "../middlewares/multer.middleware.js"
import { createPost, getPost, voteOnPoll, getUserPosts, getUserPostsByUsername } from "../controller/posts.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import pollrateLimit from "../middlewares/pollrateLimiter.middlewares.js";

const postRouter = express.Router();

postRouter.post("/post/create-post", upload.single("media"), createPost);
postRouter.get("/post/feed",getPost);
postRouter.post("/post/vote/:postId",authMiddleware, pollrateLimit, voteOnPoll);
postRouter.get("/post/user/:userId", getUserPosts);
postRouter.get("/post/user-by-username/:username", getUserPostsByUsername);

export default postRouter;