import rateLimit from "express-rate-limit";

const authrateLimit = rateLimit({
    windowMs : 15*60*1000,
    max : 5,
    message : {
        success : false,
        message : "Too many login attempts from this IP, please try again after 15 minutes"
    }
})

export default authrateLimit;