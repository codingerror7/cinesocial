import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {generateAccessToken , generateRefreshToken} from "../config/token.config.js";
import User from "../model/User.models.js";

export const signUp = async (req,res) => {
    try {  
        const {name,email,password} = req.body;
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"user already exist,please login"});
        }
        let hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password : hashPassword});
        //refresh token mechanism
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);
        res.cookie("refreshToken",refreshToken,{
            httpOnly : true,
            secure : process.env.NODE_ENVIRONMENT === "production",
            sameSite : process.env.NODE_ENVIRONMENT === "production" ? "none" : "lax",
            maxAge : 7*24*60*60*1000
        })

        // In development, include refresh token in body as a fallback (so dev env without HTTPS can test)
        const responseBody = { user, accessToken };
        if (process.env.NODE_ENVIRONMENT !== "production") {
            responseBody.refreshToken = refreshToken;
        }

        return res.status(201).json(responseBody);

    } catch (error) {
        //to get the actual and exact validation error
    if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ success: false, message: messages[0], details: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const logIn = async (req,res) => {
    try {
        const {email,password} = req.body;
        const normalizedEmail = String(req.body.email).trim().toLowerCase();
    let existUser = await User.findOne({email : normalizedEmail});
    if(!existUser){
        return res.status(404).json({message:"user not found, please signup."});
    }
    let userMatch = await bcrypt.compare(password,existUser.password);
    if(!userMatch){
        return res.status(400).json({message : "password invalid."});
    }
    //refresh token mechanism
    const accessToken = await generateAccessToken(existUser._id);
    const refreshToken = await generateRefreshToken(existUser._id);
    res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : process.env.NODE_ENVIRONMENT === "production",
        sameSite : process.env.NODE_ENVIRONMENT === "production" ? "none" : "lax",
        maxAge : 7*24*60*60*1000
    })
    // In development, include refresh token in body as a fallback
    const responseBody = { user: existUser, accessToken };
    if (process.env.NODE_ENVIRONMENT !== "production") {
        responseBody.refreshToken = refreshToken;
    }
    return res.status(200).json(responseBody);
    } catch (error) {
    if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ success: false, message: messages[0], details: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//refresh token
export const refresh = async (req,res) => {
    // Accept refresh token from cookie OR request body to support dev environments
    const token = req.cookies.refreshToken || req.body?.refreshToken;
    if(!token){
        return res.status(401).json({message : "no refresh token"});
    }
    try {
        const decoded = jwt.verify(token,process.env.REFRESH_SECRET);
        const newAccessToken = await generateAccessToken(decoded.userId);
        res.json({accessToken : newAccessToken});
    } catch (error) {
        return res.status(401).json({message : "invalid refresh token"});
    }
}


export const logOut = async (req,res) => {
    try {
        await res.clearCookie("refreshToken");
        return res.status(204).json({message : "user logout successfully"})
    } catch (error) {
        return res.status(400).json({message:error});
    }
}


//deleteAccount
export const deleteAccount = async (req,res)=>{
    try{
        const {userId} = req.body;
        const deleteUser = await User.findByIdAndDelete(userId);
        if(!deleteUser){
            return res.status(400).json({message : "cant delere user"});
        }
        return res.status(204).json({message : "user deleted successfully"});
    }
    catch(error){
        return res.status(500).json({message : "error deleting user", error : error.message});
    }
}