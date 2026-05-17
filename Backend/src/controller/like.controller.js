import Like from "../model/Like.models.js";
import Post from "../model/Post.models.js";

const LikePost = async (req,res)=> {
    try {
        const {postId} = req.params;
        const userId = req.user.userId;

        //check if like exists:
        const existingLikes = await Like.findOne({post : postId, user : userId});
        if(existingLikes){
            //if like exists, then remove it (unlike)
            await Like.findOneAndDelete({post : postId, user : userId});
            await Post.findByIdAndUpdate(postId,{$inc : {likesCount : -1}});
            return res.status(201).json("Post unliked successfully.");
        }
        //like
        await Like.create({post : postId, user : userId});
        await Post.findByIdAndUpdate(postId,{$inc : {likeCount : 1}});
        return res.status(201).json("Post liked successfully.");

    } catch (error) {
        return res.status(500).json({error : error.message}, {message : "like not working"});
    }
}

export default LikePost;