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

export const getCommunityBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({ message: "slug is required" });
        }

        const community = await Community.findOne({ slug })
            .populate('admin.userId', 'avatar username');

        if (!community && mongoose.isValidObjectId(slug)) {
            const fallback = await Community.findById(slug)
                .populate('admin.userId', 'avatar username');
            if (fallback) {
                return res.status(200).json({ success: true, community: fallback });
            }
        }

        if (!community) {
            return res.status(404).json({ message: "community not found" });
        }

        return res.status(200).json({ success: true, community });
    } catch (err) {
        return res.status(500).json({ message: "error fetching community details", error: err.message });
    }
};

export const getCommunityMessages = async (req, res) => {
    try {
        const { communityId } = req.params;
        if (!communityId || !mongoose.isValidObjectId(communityId)) {
            return res.status(400).json({ message: "valid communityId is required" });
        }

        const messages = await Message.find({ community: communityId })
            .sort({ createdAt: 1 })
            .select('user username avatar message createdAt')
            .lean();

        return res.status(200).json({ success: true, messages });
    } catch (err) {
        return res.status(500).json({ message: "error fetching community messages", error: err.message });
    }
};

export const postCommunityMessage = async (req, res) => {
    try {
        const { communityId, userId, username, avatar, message } = req.body;
        if (!communityId || !userId || !message) {
            return res.status(400).json({ message: "communityId, userId and message are required" });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "community not found" });
        }

        const isMember = community.members.some((id) => id.toString() === userId) || community.admin?.userId?.toString() === userId;
        if (!isMember) {
            return res.status(403).json({ message: "You must join the community before sending messages" });
        }

        const savedMessage = await Message.create({ community: communityId, user: userId, username, avatar: avatar || "", message });
        return res.status(201).json({ success: true, message: savedMessage });
    } catch (err) {
        return res.status(500).json({ message: "error creating message", error: err.message });
    }
};

export const joinCommunity = async (req, res) => {
    try {
        const { communityId, userId } = req.body;
        
        if (!communityId || !userId) {
            return res.status(400).json({ message: "communityId and userId are required" });
        }

        const community = await Community.findById(communityId).lean();
        if (!community) {
            return res.status(404).json({ message: "community not found" });
        }

        const alreadyMember = community.members?.some((memberId) => memberId?.toString() === userId);
        if (alreadyMember) {
            return res.status(200).json({ success: true, message: "user already a member", community });
        }

        await Community.updateOne(
            { _id: communityId },
            { $addToSet: { members: userId } }
        );

        const updatedCommunity = await Community.findById(communityId)
            .populate('admin.userId', 'avatar username')
            .lean();

        if (updatedCommunity) {
            const count = Array.isArray(updatedCommunity.members) ? updatedCommunity.members.length : (updatedCommunity.membersCount || 0);
            if (updatedCommunity.membersCount !== count) {
                await Community.updateOne({ _id: communityId }, { $set: { membersCount: count } });
                updatedCommunity.membersCount = count;
            }
        }

        return res.status(200).json({ success: true, message: "joined community successfully", community: updatedCommunity || community });
    } catch (err) {
        return res.status(500).json({ message: "error joining community", error: err.message });
    }
}
