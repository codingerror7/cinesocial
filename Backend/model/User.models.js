import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"username is required"],
        unique : [true,"username must be unique"],
        lowercase : true,
        trim : true,
        minlength : 3,
        maxlength : 20
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique : [true,"email must be unique"],
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true,"password is required"]
    },
    profilePic : {
        type : String,
        required : true,
        default : "default.jpg",
    },
    bio : {
        type : String,
        trim : true,
        minlength : 5,
        maxlength : 100
    },
    genre : {
        type : String,
        enum : ["action","thriller","emotional","gen-z","anime"],
        required : true
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

const User = mongoose.model("User",userSchema);
export default User;