import Like from "../model/Like.models.js";
import Post from "../model/Post.models.js";

const LikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const existingLikes = await Like.findOne({ post: postId, user: userId });
    if (existingLikes) {
      await Like.findOneAndDelete({ post: postId, user: userId });
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { returnDocument: 'after' }
      );

      return res.status(200).json({
        message: "Post unliked successfully.",
        liked: false,
        likesCount: updatedPost?.likesCount ?? 0,
      });
    }

    await Like.create({ post: postId, user: userId });
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: 1 } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      message: "Post liked successfully.",
      liked: true,
      likesCount: updatedPost?.likesCount ?? 0,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, message: "Like action failed." });
  }
};

export default LikePost;