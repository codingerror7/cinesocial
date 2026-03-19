import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {generateAccessToken , generateRefreshToken} from "../config/token.config.js";
import User from "../model/auth.model.js";

export const signUp = async (req,res) => {
    try {  
        const {name,password,email} = req.body;
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"user already exist,please login"});
        }
        let hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password : hashPassword});
        //refresh token mechanism
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie("refreshToken",refreshToken,{
            httpOnly : true,
            secure : process.env.NODE_ENVIRONMENT === "production",
            sameSite : "none",
            maxAge : 7*24*60*60*1000
        })
        return res.status(200).json({accessToken});

    } catch (error) {
        return res.status(500).json({message : `${error}`});
    }
}

export const logIn = async (req,res) => {
    try {
        const {email,password} = req.body;
    let existUser = await User.findOne({email});
    if(!existUser){
        await res.status(400).json({message:"user not found, please signup."});
    }
    let userMatch = await bcrypt.compare(password,existUser.password);
    if(!userMatch){
        await res.status(400).json({message : "password invalid."});
    }
    //refresh token mechanism
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : process.env.NODE_ENVIRONMENT === "production",
        sameSite : "none",
        maxAge : 7*24*60*60*1000
    })
    return res.status(200).json({accessToken});
    } catch (error) {
        return res.status(400).json({message : "something went wrong,",error});
    }
}

//refresh token
export const refresh = (req,res) => {
    const token = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({message : "no refresh token"});
    }
    try {
        const decoded = jwt.verify(token,process.env.REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decoded.userId);
        res.json({accessToken : newAccessToken});
    } catch (error) {
        return res.status(401).json({message : "invalid refresh token"});
    }
}


export const logOut = async (req,res) => {
    try {
        res.clearCookie("refreshToken");
        return res.status(200).json({message : "user logout successfully"})
    } catch (error) {
        return res.status(400).json({message:error});
    }
}
