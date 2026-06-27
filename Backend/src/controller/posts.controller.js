import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.models.js";
import Like from "../model/Like.models.js";
import redisClient from "../config/redis.config.js";


export const createPost = async (req,res) => {
    try {
        console.log("=== CREATE POST REQUEST ===");
        console.log("Body:", req.body);
        console.log("File received:", req.file ? `Yes - ${req.file.filename}` : "No file");

        const {username, userId, postedAt, postType, title, content, avatar} = req.body;

        //check for validation
        if(!username){
            return res.status(400).json({message : "required fields missing..username missing"})
        }

        // Validate and handle userId
        let validUserId = userId;
        if (!validUserId || validUserId.trim() === "" || validUserId === "anonymous") {
            // Generate a unique userId for anonymous users
            validUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log("Generated new userId for anonymous user:", validUserId);
        }

        let mediaUrls = [];

        if(req.file?.path){
            console.log("Uploading file to Cloudinary from:", req.file.path);
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (!cloudinaryResponse) {
                console.error("Cloudinary upload returned null");
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }

            // Store the secure_url from Cloudinary
            const imageUrl = cloudinaryResponse.secure_url || cloudinaryResponse.url;
            console.log("✓ Image uploaded to Cloudinary:", imageUrl);
            mediaUrls.push(imageUrl);
        }

         let pollData = null;

        if (postType === "whatif" && (!content || !content.trim())) {
          return res.status(400).json({ message: "What If content is required" });
        }

        if (postType === "poll") {
          if (!content || !content.trim()) {
            return res.status(400).json({ message: "Poll question is required" });
          }

          let options;
          try {
            options = JSON.parse(req.body.pollOptions);
          } catch (parseError) {
            console.error("Invalid poll options payload:", req.body.pollOptions, parseError);
            return res.status(400).json({ message: "Invalid poll options format" });
          }

          if (!Array.isArray(options) || options.filter(opt => typeof opt === "string" && opt.trim() !== "").length < 2) {
            return res.status(400).json({ message: "Poll must have at least 2 options" });
          }

          pollData = {
            question: content,
            options: options.map((opt) => ({
              text: String(opt).trim(),
              votes: 0,
            }))
          };
        }

        // Ensure avatar is a usable URL; fall back to generated UI avatar if missing
        const computedAvatar = (avatar && String(avatar).trim())
          ? String(avatar).trim()
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'Anonymous')}&background=6366f1&color=fff&size=128`;

        const post = await Post.create({
          user: {
            userId: validUserId,
            userName: username,
            avatar: computedAvatar
          },
            postedAt,
            postType,
            title: title || " ",
            content: content || " ", // Allow empty content
            media: mediaUrls,
            poll : pollData
        })

        console.log("✓ Post created successfully with media:", post.media);
        return res.status(201).json({success : true , message : "post saved successfully.", post});

    }
     catch (error) {
        console.error("ERROR in createPost:", error);
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
      const limit = 25; // number of posts to return per request
      const cursor = req.query.cursor; // expecting a timestamp or post ID for pagination

      //cache first page only:
      const isFirstPage = !cursor;
      if(isFirstPage){
        console.log("First page request - consider caching this response in Redis");
      }
      else{
        console.log(`Fetching posts before cursor: ${cursor}`);
      }
      const cacheKey = "feed:first-page";
      if(isFirstPage){
        const cached = await redisClient.get(cacheKey);
        if(cached){
          console.log("Cache hit for first page feed");
          const cachedData = JSON.parse(cached);
          
          // Dynamically compute user-specific likes flag
          let likedSet = new Set();
          try {
            const header = req.headers?.authorization;
            if (header && header.startsWith("Bearer ")) {
              const token = header.split(" ")[1];
              const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
              const userId = decoded?.userId;
              if (userId && cachedData.post && cachedData.post.length > 0) {
                const likedDocs = await Like.find({ user: userId, post: { $in: cachedData.post.map(p => p._id) } }).select('post').lean();
                likedDocs.forEach(d => likedSet.add(String(d.post)));
              }
            }
          } catch (e) {
            console.warn('Feed: token parse/verify failed on cache hit:', e?.message || e);
          }

          cachedData.post = (cachedData.post || []).map(p => ({
            ...p,
            isLiked: likedSet.has(String(p._id))
          }));

          return res.status(200).json(cachedData);
        }
        console.log("Cache miss for first page feed");
      }


      let query = {};

      //if cursor is provided, we fetch posts created before the cursor timestamp for pagination
      if(cursor){
        query.createdAt = {
          $lt : new Date(cursor)
        }
      }

    const post = await Post.find(query).sort({ createdAt: -1 }).limit(limit).select("user.userId user.userName user.avatar postedAt postType title content media poll commentsCount likesCount createdAt").lean();
        if(!post || post.length === 0){
            console.log("No posts found in database");
            return res.status(200).json({
                success: true,
                message: "No posts found",
                post: []
            });
        }

        const nextCursor = post.length > 0 ? post[post.length - 1].createdAt : null;
        
        // Cache the raw page data (without user-specific liked flags)
        if(isFirstPage){
          const rawResponseData = {
            success: true,
            message: "post fetched successfully.",
            post,
            nextCursor,
            hasMore: post.length === limit
          };
          await redisClient.setEx(cacheKey, 120, JSON.stringify(rawResponseData));
        }

        // Attempt to detect authenticated user from Authorization header so
        // we can mark which posts the user already liked.
        let likedSet = new Set();
        try {
          const header = req.headers?.authorization;
          if (header && header.startsWith("Bearer ")) {
            const token = header.split(" ")[1];
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            const userId = decoded?.userId;
            if (userId) {
              const likedDocs = await Like.find({ user: userId, post: { $in: post.map(p => p._id) } }).select('post').lean();
              likedDocs.forEach(d => likedSet.add(String(d.post)));
            }
          }
        } catch (e) {
          // don't block feed on token errors; feed remains public
          console.warn('Feed: token parse/verify failed:', e?.message || e);
        }

        // Attach isLiked to posts using the set we built
        const postsWithLikeFlag = post.map(p => ({
          ...p,
          isLiked: likedSet.has(String(p._id))
        }));

        const responseData = {
          success : true,
          message : "post fetched successfully.",
          post: postsWithLikeFlag,
          nextCursor,
          hasMore : postsWithLikeFlag.length === limit
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({message : error.message});
    }
}

export const voteOnPoll = async (req, res) => {
  try {
    const { postId } = req.params;
    const { optionIndex } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postType !== "poll") {
      return res.status(400).json({ message: "Not a poll post" });
    }

    if (!post.poll || !post.poll.options[optionIndex]) {
  return res.status(400).json({ message: "Invalid option" });
}

    // increment vote
    post.poll.options[optionIndex].votes += 1;

    await post.save();

    return res.status(200).json({
      success: true,
      post: post.toObject({ getters: true, versionKey: false })
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//fetch posts posted by user on his profile page
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userPosts = await Post.find({ "user.userId": userId }).sort({ createdAt: -1 }).lean();

    if (!userPosts || userPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found for this user",
        posts: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      posts: userPosts
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ message: error.message });
  }
}

export const getUserPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    const normalizedUsername = username.toLowerCase();
    const userPosts = await Post.find({ "user.userName": normalizedUsername }).sort({ createdAt: -1 }).select("user.userId postedAt postType title content media poll commentsCount likesCount").lean();

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No posts found for this username",
        posts: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      posts: userPosts
    });
  } catch (error) {
    console.error("Error fetching user posts by username:", error);
    return res.status(500).json({ message: error.message });
  }
}
