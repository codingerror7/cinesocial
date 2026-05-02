import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        minlength : 3,
        maxlength : 20
    },
    title : {
        type : String,
        maxlength : 30
    },
    email : {
        type : String,
        unique : [true,"email must be unique"],   //basic indexing.
        trim : true,
    },
    password : {
        type : String,
    },
    avatar : {
        type : String,
        default : "",
    },
    bio : {
        type : String,
        trim : true,
        minlength : 5,
        maxlength : 300
    },
    genre : [{
        type : String,
        enum : ["action","thriller","sci-fi","drama","mystery","emotional","horror","anime"],
    }],
    fantag : {
        type : String,
        trim : true,
        maxlength : 30
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