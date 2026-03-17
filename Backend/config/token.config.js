import jwt from "jsonwebtoken";

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.JWT_SIGN,{expiresIn:"1d"});
        return token;
    } catch (error) {
        throw new error("TOKEN NOT GENERATED");
        console.log(error);
    }
}

export default genToken;
