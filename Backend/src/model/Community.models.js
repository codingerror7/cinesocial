import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        minlength : 2,
        maxlength : 40
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
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
        enum : ["PsychologicalThriller","CosmicHorror","darkComedy","coldHorror","animeFilms","IndieCinema","slowCinema","mindbending","dystopian","postApocalyptic","supernaturalThriller","neoNoir","existentialDrama","surrealistCinema","cultClassics","arthouse","experimentalFilms"]
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

// optimized indexes

communitySchema.index({ createdAt : -1,title: "text" });

const Community = mongoose.model("Community",communitySchema);

export default Community;