import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.config.js";
import authRouter from "./src/routes/auth.route.js";
import postRouter from "./src/routes/post.routes.js";
import profileRouter from "./src/routes/profile.routes.js";
import likeAndCommentsRouter from "./src/routes/likeAndCommentsRoute.js";

dotenv.config({
    path : "./.env"     //exact .env path, we have to call dotenv.config() only in server.js
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.use("/api/auth",authRouter);
app.use("/api",postRouter);
app.use("/api",profileRouter);
app.use("/api",likeAndCommentsRouter);

//test route
app.get("/home",(req,res)=>{
    res.send("db connected..");
})
app.get("/what",(req,res)=>{
    res.send("app for cinephile!");
})

app.listen(PORT, "0.0.0.0",()=>{
    console.log(`running at ${PORT}`);
    connectDB();
});