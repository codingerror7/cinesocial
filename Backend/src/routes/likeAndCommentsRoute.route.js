import express from "express";
import LikePost from "../controller/like.controller.js";
import {createComment, getComments} from "../controller/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const likeAndCommentsRouter = express.Router();

likeAndCommentsRouter.post("/like/:postId",authMiddleware, LikePost);
likeAndCommentsRouter.post("/comment/:postId",authMiddleware,createComment);
likeAndCommentsRouter.get("/comments/:postId", getComments);

export default likeAndCommentsRouter;