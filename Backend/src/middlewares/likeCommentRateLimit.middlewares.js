import rateLimit from 'express-rate-limit';

const likeCommentRateLimit = rateLimit({
    windowMs : 60*1000,   //1 minute
    max : 15,             //limit each IP to 15 requests per windowMs
    message : {
        stattus : 429,
        success : false,
        message : "Too many requests, please try again after a minute"
    }
})
    
export default likeCommentRateLimit;