import express from "express";
import upload from "../middlewares/multer.middleware.js"
import { createPost, getPost, voteOnPoll, getPostById, getUserPosts, getPostsByUsername } from "../controller/posts.controller.js";

const postRouter = express.Router();

postRouter.post("/post/create-post", upload.single("media"), createPost);
postRouter.get("/post/feed",getPost);
postRouter.post("/post/vote/:postId", voteOnPoll);
postRouter.get("/post/user/:userId", getUserPosts);
postRouter.get("/post/user-by-username/:username", getPostsByUsername);
postRouter.get("/post/:id", getPostById);

export default postRouter;