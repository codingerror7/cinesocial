import mongoose from "mongoose";
import dotenv from "dotenv";
import genToken from "../config/token.config.js";
import bcrypt from "bcrypt";
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
        const token = genToken(user._id);
        res.cookie("token",token,{
            httpOnly : true,
            secure : true,
            sameSite : "none",
            maxAge : 7*24*60*60*1000 
        })
        return res.status(200).json(user,token);

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
    let token = genToken(user._id);
    res.cookie("token",token),{
        httpOnly : true,
        secure : true,
        sameSite : "none",
        maxAge : 7*24*60*60*1000
    }
    return res.status(200).json(user,token);
    } catch (error) {
        return res.status(400).json({message : "something went wrong,",error});
    }
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message : "user logout successfully"})
    } catch (error) {
        return res.status(400).json({message:error});
    }
}
