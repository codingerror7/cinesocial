import mongoose from "mongoose";
import redisClient from "../config/redis.config.js";
import User from "../model/User.models.js";


export const createProfile = async (req,res) => {
    try {
        const {title: rawTitle, avatar: rawAvatar, bio, fantag, dob, userId, genres, genre} = req.body;

        // Determine profileId: prefer explicit userId, then route param, then Authorization token if present
        let profileId = userId || req.params?.id;
        if (!profileId) {
            const header = req.headers?.authorization;
            if (header && header.startsWith('Bearer ')) {
                try {
                    const token = header.split(' ')[1];
                    const decoded = await (async () => {
                        try { return await import('jsonwebtoken').then(m => m.verify(token, process.env.ACCESS_SECRET)); }
                        catch { return null }
                    })();
                    profileId = decoded?.userId || decoded?._id || profileId;
                } catch (e) {
                    // token decode failed; we'll fall through and handle missing id below
                }
            }
        }
        // sanitize genres and filter to allowed list
        const allowedGenres = ["action","thriller","sci-fi","drama","mystery","emotional","horror","anime"];
        const updatedGenres = Array.isArray(genres)
            ? genres.map(g => String(g).toLowerCase()).filter(g => allowedGenres.includes(g))
            : genre && allowedGenres.includes(String(genre).toLowerCase())
                ? [String(genre).toLowerCase()]
                : [];

        if (!profileId) {
            return res.status(400).json({ message: "userId missing: provide userId in body, route param, or send a valid Authorization token" });
        }

        // Provide safe defaults and sanitize inputs rather than failing when optional fields are missing
        const title = (rawTitle && String(rawTitle).trim()) ? String(rawTitle).trim() : "Cinephile";
        const avatar = (rawAvatar && String(rawAvatar).trim()) ? String(rawAvatar).trim() : `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'Anonymous')}&background=6366f1&color=fff&size=128`;

        // sanitize bio: enforce minimum length; if too short, set to empty string to avoid mongoose validation error
        const sanitizedBio = (typeof bio === 'string' && bio.trim().length >= 5) ? String(bio).trim() : "";

        // sanitize dob: only include if valid date
        let sanitizedDob = undefined;
        if (dob && String(dob).trim() !== "") {
            const parsed = new Date(dob);
            if (!isNaN(parsed.getTime())) {
                sanitizedDob = parsed;
            }
        }

        // build update object with only valid fields
        const updateObj = {
            title,
            avatar,
            bio: sanitizedBio,
            fantag: (fantag && String(fantag).trim()) ? String(fantag).trim() : undefined,
            genre: updatedGenres.length > 0 ? updatedGenres : undefined,
        };
        if (sanitizedDob) updateObj.dob = sanitizedDob;

        console.log('createProfile updateObj:', updateObj);

        const userProfile = await User.findByIdAndUpdate(
            profileId,
            updateObj,
            { returnDocument: 'after', runValidators: true }
        );

        if (!userProfile) {
            return res.status(404).json({ message: "user not found" });
        }
        
        await redisClient.del(`profile:${profileId}`);  //deleting the cached profile data in redis when profile is updated to maintain cache consistency

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