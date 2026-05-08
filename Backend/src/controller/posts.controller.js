import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.models.js";


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

       if (postType === "poll") {
  const options = JSON.parse(req.body.pollOptions);

  pollData = {
    question: content,
    options: options.map(opt => ({
      text: opt,
      votes: 0
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
        const post = await Post.find().sort({ createdAt: -1 }).limit(10);
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
        
        return res.status(200).json({
            success : true,
            message : "post fetched successfully.",
            post
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
      post
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};