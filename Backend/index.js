import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import globalRateLimiter from "./src/middlewares/rateLimiter.middlewares.js";
import connectDB from "./src/config/db.config.js";
import authRouter from "./src/routes/auth.route.js";
import postRouter from "./src/routes/post.routes.js";
import profileRouter from "./src/routes/profile.routes.js";
import likeAndCommentsRouter from "./src/routes/likeAndCommentsRoute.route.js";
import communityRoutes from "./src/routes/community.routes.js";
import { initSocket } from "./src/socket/socket.js";
import {connectRedis} from "./src/config/redis.config.js";

dotenv.config({
    path : "./.env"
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());   //to compress the response data sent to clients, improving performance and reducing bandwidth usage, especially for large responses like images or JSON data.

//cors for http:
const CLIENT_ORIGIN = process.env.CORS_ORIGIN

app.use(cors({
    origin : CLIENT_ORIGIN,
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//create server
const server = http.createServer(app);

// socket module handles Socket.IO connection and room events
const io = initSocket(server, CLIENT_ORIGIN);

// Allow images from Cloudinary
app.use((req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});


app.use(express.static("public"));

app.use(express.json({limit : "16kb"}));    //to read users data like name,email,password through req.body, and 1 req me 1 time per 16kb se jyada data nhi ayga, basic security feature. agr 16 kb se jyada aya to error dega server.

app.use(cookieParser());    //to read data in cookies coming from users browser and to validate user and to set cookies in user's browser
app.use(express.urlencoded({   //its main task is to handle url encoded form data coming from client and is used in post request to read and store form data in db.
    extended : true , 
    limit : "16kb", 
    parameterLimit : 5000        //to prevent DoS attacks
}));

app.use(globalRateLimiter);   //to prevent DDoS attacks and to limit the number of requests a user can make in a certain time frame, protecting the server from being overwhelmed by too many requests.

app.use("/api/auth",authRouter);
app.use("/api",postRouter);
app.use("/api",profileRouter);
app.use("/api",likeAndCommentsRouter);
app.use("/api",communityRoutes);

//test route
app.get("/home",(req,res)=>{
    res.send("db connected..");
})
app.get("/what",(req,res)=>{
    res.send("app for cinephile!");
})

// server.listen(PORT, "0.0.0.0",()=>{
//     console.log(`running at ${PORT}`);
//     connectDB();
//     connectRedis();
// });

const startServer = async () => {
    try{
        await connectDB();
        await connectRedis();
        server.listen(PORT, "0.0.0.0", ()=>{
            console.log(`Server running at ${PORT}`);
        });
    }
     catch(error){
        console.log("Error starting server: ", error);
     }
}
startServer();