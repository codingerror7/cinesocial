import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/home",(req,res)=>{
    res.send("db connected..");
})
app.listen(PORT,()=>{
    console.log(`running at ${PORT}`);
    connectDB();
})