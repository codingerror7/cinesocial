import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.models.js";


export const createPost = async (req,res) => {
    try {
        const {username, userId, postedAt, postType, content} = req.body;
        //check for validation
        if(!username || !content){
            return res.status(400).json({message : "required fields missing..username or content missing"})
        }

        let mediaUrls = [];

        if(req.file?.path){
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (!cloudinaryResponse) {
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }
            mediaUrls.push(cloudinaryResponse.url);

        }
        let parsedPollOptions = [];
    if (req.body.pollOptions) {
      parsedPollOptions = JSON.parse(req.body.pollOptions);
    }

        const post = await Post.create({
            user: {
                userId: new mongoose.Types.ObjectId(userId),
                userName: username,
                profilePic: ""
            },
            postedAt,
            postType,
            content,
            media: mediaUrls,
            pollOptions: parsedPollOptions
        })

        return res.status(201).json({success : true , message : "post saved successfully.", post});

    } catch (error) {
        //to get the actual and exact validation error
    if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ success: false, message: messages[0], details: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


export const getPost = async (req,res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 }).limit(10);
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        return res.status(200).json({
            success : true,
            message : "post fetched successfully.",
            post
        });
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}