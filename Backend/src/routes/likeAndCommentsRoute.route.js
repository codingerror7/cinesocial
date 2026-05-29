import express from "express";
import LikePost from "../controller/like.controller.js";
import {createComment, getComments} from "../controller/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import likeCommentRateLimit from "../middlewares/likeCommentRateLimit.middlewares.js"

const likeAndCommentsRouter = express.Router();

likeAndCommentsRouter.post("/like/:postId",authMiddleware,likeCommentRateLimit,LikePost);
likeAndCommentsRouter.post("/comment/:postId",authMiddleware,likeCommentRateLimit,createComment);
likeAndCommentsRouter.get("/comments/:postId", getComments);

export default likeAndCommentsRouter;