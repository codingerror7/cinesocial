import mongoose from 'mongoose'
import dotenv from 'dotenv'

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        if(!process.env.MONGO_URL){
            throw new Error("Mongo url variable is not present in dotenv file.");
        }
        console.log("database connected...no error");
    } catch (error) {
        console.log("error:",error);
    }
}
export default connectDB;