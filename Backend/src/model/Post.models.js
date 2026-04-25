import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        userName : {
            type : mongoose.Schema.Types.String,
            ref : "User",
            lowercase : true,
            trim : true,
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

    comment : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    likesCount : {
        type : Number,
        required : true,
        default : 0
    }
},{timestamps : true});

//indexing for optimized query search
postSchema.index({userName : 1});
postSchema.index({postedAt : -1});

const Post = mongoose.model("Post",postSchema);

export default Post;