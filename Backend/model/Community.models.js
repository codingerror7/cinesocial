import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 20
    },
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    description : {
        type : String,
        minlength : 5,
        maxlength : 50
    },
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
        default : 0
    },

    private : {
    type : Boolean,
    default : false
}
},{timestamps : true});

const Community = mongoose.model("Community",communitySchema);

export default Community;