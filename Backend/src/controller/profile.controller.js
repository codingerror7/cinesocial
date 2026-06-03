import mongoose from "mongoose";
import redisClient from "../config/redis.config.js";
import User from "../model/User.models.js";


export const createProfile = async (req,res) => {
    try {
        const {title,avatar,bio,fantag,dob,userId,genres,genre} = req.body;
        const profileId = userId || req.params?.id;
        const updatedGenres = Array.isArray(genres)
            ? genres
            : genre
                ? [genre]
                : [];

        if(!profileId) {
            return res.status(400).json({message : "userId missing"});
        }
        if(!title) {
            return res.status(400).json({message : "title missing"});
        }
        if(!avatar){
            return res.status(400).json({message : "avatar missing"});
        }

        const userProfile = await User.findByIdAndUpdate(
            profileId,
            {
                title,
                avatar,
                bio,
                fantag,
                genre: updatedGenres,
                dob
            },
            { new: true, runValidators: true }
        );

        if (!userProfile) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.status(201).json({message : "profile saved successfully", success : true, userProfile});

    } 
    catch (error) {
        if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ success: false, message: messages[0], details: messages });
    }
    return res.status(500).json({message:"create profile failed",error});
    }
}

export const getProfile = async (req,res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "profile id required" });
        }
        //redis caching implementation
        const cachedKey = `profile:${id}`;
        const cachedProfile = await redisClient.get(cachedKey);
        if(cachedProfile){
            try{
                console.log("cache hit for profile data");
                return res.status(200).json(JSON.parse(cachedProfile));
            }
            catch{
                console.log("cache missed due to parsing error, fetching from db");
            }
        }

        const profile = await User.findById(id).select("-password");  //select is a mongoose query used to include and exclude the values, here "minus" sign is telling mongodb to exclude password field in the document and not to send password with response.
        if(!profile){
            return res.status(404).json({message : "profile not found"});
        }

        await redisClient.setEx(cachedKey, 600, JSON.stringify(profile));  //caching the profile data in redis with an expiration time of 600 seconds (10 minutes)

        return res.status(200).json(profile);

    } catch (error) {
        return res.status(500).json({message : "failed to fetch user profile from db",error});
    }
}