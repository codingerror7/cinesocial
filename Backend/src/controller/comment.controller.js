import mongoose from "mongoose";
import Comment from "../model/Comment.models.js";
import Post from "../model/Post.models.js";

export const createComment = async (req,res)=>{
    try{
        const {postId} = req.params;
        const {userId,userName,avatar,content,commentedAt} = req.body;
        if(!content || content.trim === ""){
            return res.status(400).json("content misssing");
        }
        const comment = await Comment.create({
            post : postId,
            user : {
                userId : userId,
                userName : userName,
                avatar : avatar || " "
            },
            content : content,
            commentedAt : commentedAt || Date.now()
        })
        return res.status(201).json({message : "Comment created successfully", comment});
    }
    catch(err){
        return res.status(500).json({message : "Error creating comment", error : err});
    }
}

export const getComments = async (req,res) => {
    try {
        const {postId} = req.params;
        const comments = await Comment.find({post : postId});
        return res.status(200).json(comments);
    }
    catch(err){
        return res.status(500).json({message : "Error fetching comments", error : err});
    }
}