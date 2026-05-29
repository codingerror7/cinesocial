import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    community : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Community",
        required : true,
        index: true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index: true
    },
    username: { 
        type: String,
        required: true,
         trim: true 
        },
    avatar: { 
        type: String,
         default: "",
         trim: true 
        },
    message : {
         type : String,
         required : true 
        },
},{timestamps : true});

// indexes for faster queries
messageSchema.index({ community: 1, createdAt: -1 });

const Message = mongoose.model("Message",messageSchema);

export default Message;