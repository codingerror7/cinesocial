import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());    //to read users data like name,email,password through req.body
app.use(cookieParser());    //to read data in cookies coming from users browser and to validate user

app.use("/api/auth",authRouter);

app.get("/home",(req,res)=>{
    res.send("db connected..");
})
app.get("/what",(req,res)=>{
    res.send("app for cinephile!");
})
app.listen(PORT,()=>{
    console.log(`running at ${PORT}`);
    connectDB();
})