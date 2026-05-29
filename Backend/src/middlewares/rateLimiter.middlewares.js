import rateLimit from "express-rate-limit";

 const globalLimiter = rateLimit({
    windowMs : 15*60*1000,
    max : 200,
    standardHeaders : true,
    legacyHeaders : false,
    message : {
        success : false,
        message : "Too many requests from this IP, please try again after 15 minutes"
    }
})
      
export default globalLimiter;