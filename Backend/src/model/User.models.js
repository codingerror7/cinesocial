import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"username is required"],
        trim : true,
        minlength : 3,
        maxlength : 20
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique : [true,"email must be unique"],   //basic indexing.
        trim : true,
    },
    password : {
        type : String,
        required : [true,"password is required"]
    },
    profilePic : {
        type : String,
        default : "default.jpg",
    },
    coverPhoto : {
        type : String,
        default : "default.jpg"
    },
    bio : {
        type : String,
        trim : true,
        minlength : 5,
        maxlength : 300
    },
    genre : {
        type : String,
        enum : ["action","thriller","emotional","gen-z","anime"],
    },
    dob : {
        type : Date,
        trim : true
    },
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
},
{
    timestamps : true
});

//indexing for optimized query search
userSchema.index({name : 1}); 
userSchema.index({createdAt : -1});

const User = mongoose.model("User",userSchema);
export default User;