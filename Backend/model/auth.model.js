import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"username is required"],
        unique : [true,"username must be unique"]
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique : [true,"email must be unique"]
    },
    password : {
        type : String,
        required : [true,"password is required"]
    }
})

const User = mongoose.model("User",userSchema);
export default User;