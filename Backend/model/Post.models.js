import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        userName : {
            type : String,
            required : true,
            lowercase : true,
            trim : true
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
        enum : ["story","review","poll"]
    },
    content : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 500
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
},{timestamps : true})

const Post = mongoose.model("Post",postSchema);

export default Post;