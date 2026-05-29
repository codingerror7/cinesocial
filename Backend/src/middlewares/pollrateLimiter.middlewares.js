import rateLimit from 'express-rate-limit';

const pollrateLimit = rateLimit({
    windowMs : 60*1000,   //1 minute
    max : 15,             //limit each IP to 15 requests per windowMs
    statusCode : 429,
    message : {
        success : false,
        message : "Too many requests, please try again after a minute"
    }
})

export default pollrateLimit;