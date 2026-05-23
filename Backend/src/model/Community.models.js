import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        minlength : 2,
        maxlength : 40
    },
    communityBanner : {
        type : String,   
        default : "",
    },
    admin : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : {
            type : String
        }
    },
    description : {
        type : String,
        minlength : 5,
        maxlength : 500
    },
    tags : [{
        type : String,
        enum : ["action","thriller","sci-fi","drama","mystery","emotional","horror","anime"]
    }],
    createdAt : {
        type : Date,
        default : Date.now
    },
    members : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
],
    membersCount : {
        type : Number,
        default : 1
    }
},{timestamps : true});

communitySchema.index({ title: "text" });
communitySchema.index({ createdAt : -1 });

const Community = mongoose.model("Community",communitySchema);

export default Community;