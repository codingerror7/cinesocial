import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        userName : {
            type : String,
            lowercase : true,
            trim : true,
        },
        profilePic : {
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
        enum : ["story","poll","what-if","image"]
    },
    content : {
        type : String,
        required : true,
        minlength : 5,
    },
    media : [
        {
        type : String,
        default : ""
    }
],
    poll : {
        questions : String,
        options : [
            {
                text : String,
                votes : Number
            }
        ]
    },
    pollOptions : [
        {
            type : String
        }
    ],
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