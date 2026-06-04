import jwt from "jsonwebtoken";

//IMPLEMENTING REFRESH TOKEN MACHANISM

export const generateAccessToken = async (userId) => {
    try {
        if(!process.env.ACCESS_SECRET){
            throw new Error("ACCESS SECRET VARIABLE missing in dotenv file.");
        }
        const accessExpiry = process.env.ACCESS_SECRET_EXPIRY || "15m";
        const token = await jwt.sign({userId}, process.env.ACCESS_SECRET, { expiresIn: accessExpiry });
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
        const refreshExpiry = process.env.REFRESH_SECRET_EXPIRY || "7d";
        const token = await jwt.sign({userId}, process.env.REFRESH_SECRET, { expiresIn: refreshExpiry });
        return token;
    } catch (error) {
        console.log(`token not generated ${error}`);
    }
}
