import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
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
        profilePic : {
            type : String,
            default : ""
        }
    },
    content : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 50
    },
    commentedAt : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});


//indexing for optimized query search
commentSchema.index({userId : 1});
commentSchema.index({createdAt : -1});

const Comment = mongoose.model("Comment",commentSchema);

export default Comment;