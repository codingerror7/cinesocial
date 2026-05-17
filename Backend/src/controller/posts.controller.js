import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.models.js";
import Like from "../model/Like.models.js";


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

        const post = await Post.create({
            user: {
                userId: validUserId,
                userName: username,
                avatar: avatar || " "
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
    const post = await Post.find().sort({ createdAt: -1 }).limit(25);
        if(!post || post.length === 0){
            console.log("No posts found in database");
            return res.status(200).json({
                success: true,
                message: "No posts found",
                post: []
            });
        }
        
        console.log(`Retrieved ${post.length} posts from database`);
        post.forEach((p, idx) => {
            console.log(`Post ${idx}: media count = ${p.media?.length || 0}, media = ${JSON.stringify(p.media)}`);
        });
        
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
        const postsWithLikeFlag = post.map(p => {
          const po = p.toObject ? p.toObject() : { ...p };
          po.isLiked = likedSet.has(String(p._id));
          return po;
        });

        return res.status(200).json({
          success : true,
          message : "post fetched successfully.",
          post: postsWithLikeFlag
        });
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