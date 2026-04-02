import jwt from "jsonwebtoken";

//IMPLEMENTING REFRESH TOKEN MACHANISM

export const generateAccessToken = async (userId) => {
    try {
        if(!process.env.ACCESS_SECRET){
            throw new error("ACCESS SECRET VARIABLE missing in dotenv file.");
        }
        const token = await jwt.sign({userId},process.env.ACCESS_SECRET,{expiresIn : "15m"});
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}

export const generateRefreshToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.REFRESH_SECRET,{expiresIn : "7d"});
        if(!process.env.REFRESH_SECRET){
            throw new error("REFRESH SECRET VARIABLE not present in dotenv file.")
        }
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}