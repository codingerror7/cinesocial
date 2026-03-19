import jwt from "jsonwebtoken";

//IMPLEMENTING REFRESH TOKEN MACHANISM

export const generateAccessToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.ACCESS_SECRET,{expiresIn : "15m"});
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}

export const generateRefreshToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.REFRESH_SECRET,{expiresIn : "7d"});
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}