import jwt from "jsonwebtoken";

//IMPLEMENTING REFRESH TOKEN MACHANISM

export const generateAccessToken = async (userId) => {
    try {
        if(!process.env.ACCESS_SECRET){
            throw new Error("ACCESS SECRET VARIABLE missing in dotenv file.");
        }
        const token = await jwt.sign({userId},process.env.ACCESS_SECRET,{expiresIn : "30m"});
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}

export const generateRefreshToken = async (userId) => {
    try {
        if(!process.env.REFRESH_SECRET){
            throw new Error("REFRESH SECRET VARIABLE not present in dotenv file.")
        }
        const token = await jwt.sign({userId},process.env.REFRESH_SECRET,{expiresIn : "7d"});
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}
