import rateLimit from 'express-rate-limit';

const pollrateLimit = rateLimit({
    windowMs : 60*1000,   //1 minute
    max : 10,
    statusCode : 429,
    message : {
        success : false,
        message : "Too many requests, please try again after a minute"
    }
})

export default pollrateLimit;