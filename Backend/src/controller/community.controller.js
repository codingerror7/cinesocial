import mongoose from "mongoose";
import Community from "../model/Community.models.js";
import Message from "../model/Message.model.js";

const normalizeSlug = (title) => {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

const generateUniqueSlug = async (title) => {
    const baseSlug = normalizeSlug(title);
    let slug = baseSlug;
    let counter = 0;

    while (await Community.findOne({ slug })) {
        counter += 1;
        slug = `${baseSlug}-${counter}`;
    }

    return slug;
};

export const createCommunities = async (req,res) => {
    try {
        const {title,description,tags,communityBanner,userId,username,createdAt} = req.body;
        if(!title || !description || !userId || !username){
            return res.status(400).json({message : "please provide all required fields"});
        }

        const normalizedTags = Array.isArray(tags)
            ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)
            : typeof tags === 'string'
                ? tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean)
                : [];

        const slug = await generateUniqueSlug(title);
        const community = await Community.create({
            admin : {
                userId,
                username
            },
            title,
            slug,
            description,
            tags: normalizedTags,
            communityBanner: communityBanner || "",
            members: [userId],
            membersCount: 1,
            createdAt: createdAt ? new Date(createdAt) : undefined
        });

        if(!community){
            return res.status(400).json({message : "community creation failed"});
        }
        return res.status(201).json({message : "community created successfully",success : true,community});
    }
    catch(error){
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages[0], details: messages });
        }
        return res.status(500).json({message:"community creation failed",error: error.message || error});
    }
}

export const getCommunities = async (req,res) => {
    try{
        const allCommunities = await Community.find()
            .sort({createdAt : -1})
            .limit(10)
            .select('slug title description communityBanner tags admin membersCount createdAt _id')
            .populate('admin.userId', 'avatar username');
        
        if(!allCommunities || allCommunities.length === 0){
            return res.status(200).json({success : true, communities : []});
        }
        
        const enrichedCommunities = allCommunities.map(c => {
            const community = c.toObject();
            return {
                ...community,
                admin: {
                    userId: community.admin?.userId?._id,
                    username: community.admin?.username,
                    avatar: community.admin?.userId?.avatar || ""
                }
            };
        });
        
        return res.status(200).json({success : true, communities : enrichedCommunities});
    }
    catch(err) {
        return res.status(500).json({message : "error 500 while fetching communities", error: err.message});
    }
}

export const getJoinedCommunities = async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message : "user id missing"});
        }
        const joinedCommunities = await Community.find({
            $or: [
                { members: id },
                { "admin.userId": id }
            ]
        }).select('slug title description communityBanner tags admin membersCount createdAt _id')
            .populate('admin.userId', 'avatar username');
        
        if(!joinedCommunities || joinedCommunities.length === 0){
            return res.status(200).json({success : true, joinedCommunities : []});
        }
        
        const enrichedCommunities = joinedCommunities.map(c => {
            const community = c.toObject();
            return {
                ...community,
                admin: {
                    userId: community.admin?.userId?._id,
                    username: community.admin?.username,
                    avatar: community.admin?.userId?.avatar || ""
                }
            };
        });
        
        return res.status(200).json({success : true, joinedCommunities : enrichedCommunities});
    }
    catch(err){
        return res.status(500).json({message : "error 500 while fetching joined communities", error: err.message});
    }
}
