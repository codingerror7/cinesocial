import mongoose from "mongoose";
import redisClient from "../config/redis.config.js";
import Community from "../model/Community.models.js";
import { getMessagesByCommunity } from "../services/message.service.js";

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
    let suffix = 0;

    while (await Community.findOne({ slug })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
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
            ? tags.map((tag) => String(tag).trim()).filter(Boolean)
            : typeof tags === 'string'
                ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
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
        await redisClient.del("all_communities");
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
        const cachedKey = "all_communities";
        const cachedCommunities = await redisClient.get(cachedKey);
        if(cachedCommunities){
            console.log("cache hit for communities data");
            return res.status(200).json(JSON.parse(cachedCommunities));
        }
        console.log("cache miss for communities data, fetching from database");
        
        const allCommunities = await Community.find()
            .sort({createdAt : -1})
            .limit(25)
            .select('slug title description communityBanner tags admin membersCount createdAt _id')
            .populate('admin.userId', 'avatar username')
            .lean();
        
        if(!allCommunities || allCommunities.length === 0){
            const emptyRes = {success : true, communities : []};
            await redisClient.setEx(cachedKey, 300, JSON.stringify(emptyRes));
            return res.status(200).json(emptyRes);
        }
        
        const enrichedCommunities = allCommunities.map(c => {
            return {
                ...c,
                admin: {
                    userId: c.admin?.userId?._id,
                    username: c.admin?.username,
                    avatar: c.admin?.userId?.avatar || ""
                }
            };
        });

        const resData = {success : true, communities : enrichedCommunities};
        await redisClient.setEx(cachedKey, 300, JSON.stringify(resData));

        return res.status(200).json(resData);
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
            .populate('admin.userId', 'avatar username')
            .lean();
        
        if(!joinedCommunities || joinedCommunities.length === 0){
            return res.status(200).json({success : true, joinedCommunities : []});
        }
        
        const enrichedCommunities = joinedCommunities.map(c => {
            return {
                ...c,
                admin: {
                    userId: c.admin?.userId?._id,
                    username: c.admin?.username,
                    avatar: c.admin?.userId?.avatar || ""
                }
            };
        });
        
        return res.status(200).json({success : true, joinedCommunities : enrichedCommunities});
    }
    catch(err){
        return res.status(500).json({message : "error 500 while fetching joined communities", error: err.message});
    }
}


export const getCommunityBySlug = async (req,res) => {
    try{
        const {slug} = req.params;
        if(!slug){
            return res.status(400).json({message : "community slug missing"});
        }
        
        let query = {};
        if (mongoose.Types.ObjectId.isValid(slug)) {
            query = { _id: slug };
        } else {
            const normalizedSlug = normalizeSlug(slug);
            query = { slug: normalizedSlug };
        }

        const community = await Community.findOne(query).populate('admin.userId', 'avatar username').lean();
        if(!community){
            return res.status(404).json({message : "community not found"});
        }
        return res.status(200).json({success : true, community});
    }
    catch(error){
        return res.status(500).json({message : "error 500 while fetching community by slug", error: error.message});
    }
}

export const joinCommunity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authorized" });
        }

        if (!communityId) {
            return res.status(400).json({ message: "communityId is required" });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        const alreadyMember = community.members.some((member) => String(member) === String(userId))
            || String(community.admin?.userId) === String(userId);

        if (alreadyMember) {
            return res.status(200).json({ success: true, message: "Already a member", community });
        }

        community.members.push(userId);
        community.membersCount = Math.max(community.membersCount + 1, community.members.length);
        await community.save();

        const updatedCommunity = await Community.findById(communityId).populate('admin.userId', 'avatar username');
        await redisClient.del("all_communities");

        return res.status(200).json({ success: true, message: "Joined community successfully", community: updatedCommunity });
    } catch (error) {
        console.error("Join community error:", error);
        return res.status(500).json({ message: "Unable to join community", error: error.message });
    }
};

export const getCommunityMessages = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "User not authorized" });
        }

        if (!communityId) {
            return res.status(400).json({ message: "communityId is required" });
        }

        const community = await Community.findOne({
            _id: communityId,
            $or: [
                { members: userId },
                { "admin.userId": userId }
            ]
        }).lean();

        if (!community) {
            return res.status(403).json({ message: "You must join this community to view messages" });
        }

        const messages = await getMessagesByCommunity(communityId, 100);
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Get community messages error:", error);
        return res.status(500).json({ message: "Unable to load messages", error: error.message });
    }
};