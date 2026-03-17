import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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