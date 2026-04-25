import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.models.js";


export const createPost = async (req,res) => {
    try {
        console.log("Received createPost request");
        console.log("Body:", req.body);
        console.log("File:", req.file);
        const {username, userId, postedAt, postType, title, content, avatar} = req.body;
        //check for validation
        if(!username){
            return res.status(400).json({message : "required fields missing..username missing"})
        }

        let mediaUrls = [];

        if(req.file?.path){
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (!cloudinaryResponse) {
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }
            mediaUrls.push(cloudinaryResponse.url);

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
                userId: new mongoose.Types.ObjectId(userId),
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