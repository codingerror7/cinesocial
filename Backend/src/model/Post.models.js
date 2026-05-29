import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user : {
        userId : {
            type : String,
            required : true
        },
        userName : {
            type : String,
            lowercase : true,
            trim : true,
            required : true
        },
        avatar : {
            type : String,
            default : ""
        }
    },
    postedAt : {
        type : Date,
        default : Date.now,
        trim : true
    },
    postType : {
        type : String,
        enum : ["story","poll","whatif","image"]
    },
    title : {
        type : String,
        default : "",
    },
    content : {
        type : String,
        default : "",
    },
    media : [
        {
        type : String,
        default : ""
    }
],
    poll : {
        question : String,
        options : [
            {
                text : String,
                votes : {
                    type : Number,
                    default : 0
                }
            }
        ]
    },
    commentsCount : {
        type : Number,
        required : true,
        default : 0
    },
    likesCount : {
        type : Number,
        required : true,
        default : 0
    }
},{timestamps : true});

//indexing for optimized query search
postSchema.index({createdAt : -1});


const Post = mongoose.model("Post",postSchema);

export default Post;