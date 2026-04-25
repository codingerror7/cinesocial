import express from "express";
import upload from "../middlewares/multer.middleware.js"
import { createPost, getPost, voteOnPoll } from "../controller/posts.controller.js";

const postRouter = express.Router();

postRouter.post("/post/create-post", upload.single("media"), createPost);
postRouter.get("/post/feed",getPost);
postRouter.post("/post/vote/:postId", voteOnPoll);

export default postRouter;