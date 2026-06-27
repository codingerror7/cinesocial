import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required: true
    },
    user : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        userName : {
            type : String,
            required  : true,
            trim : true,
            lowercase : true
        },
        avatar : {
            type : String,
            default : ""
        }
    },
    content : {
        type : String,
        required : true,
    },
    commentedAt : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});


//indexing for optimized query search
commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model("Comment",commentSchema);

export default Comment;