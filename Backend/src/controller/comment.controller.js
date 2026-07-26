import mongoose from "mongoose";
import Comment from "../model/Comment.models.js";
import Post from "../model/Post.models.js";
import User from "../model/User.models.js";
import redisClient from "../config/redis.config.js";

export const createComment = async (req,res)=>{
    try{
        const {postId} = req.params;
        const {content} = req.body;
        const authUserId = req.user?.userId;

        if(!content || content.trim() === ""){
            return res.status(400).json({message: "content missing"});
        }
        if(!authUserId){
            return res.status(401).json({message: "User not authorized."});
        }

        const authUser = await User.findById(authUserId).lean();
        if(!authUser){
            return res.status(404).json({message: "User not found."});
        }

        const comment = await Comment.create({
            post : postId,
            user : {
                userId : authUserId,
                userName : authUser.name || authUser.userName || 'Anonymous',
                avatar : authUser.avatar || ""
            },
            content : content.trim(),
            commentedAt : Date.now()
        });

        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        await redisClient.del("feed:first-page");

        return res.status(201).json({message : "Comment created successfully", comment});
    }
    catch(err){
        console.error('Error creating comment:', err);
        return res.status(500).json({message : "Error creating comment", error : err.message || err});
    }
}

export const getComments = async (req,res) => {
    try {
        const {postId} = req.params;
        const comments = await Comment.find({post : postId}).sort({ createdAt: -1 }).lean();
        return res.status(200).json(comments);
    }
    catch(err){
        return res.status(500).json({message : "Error fetching comments", error : err});
    }
}