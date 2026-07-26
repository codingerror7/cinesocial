import mongoose from 'mongoose'
import dotenv from 'dotenv'

const connectDB = async () => {
    try {
        if(!process.env.MONGO_URL){
            throw new Error("Mongo url variable is not present in dotenv file.");
        }
        await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 100,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000
        });
        console.log("database connected...no error");
    } catch (error) {
        console.log("error:",error);
        process.exit(1);
    }
}
export default connectDB;