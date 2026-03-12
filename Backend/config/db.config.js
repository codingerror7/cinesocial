import mongoose from 'mongoose'
import dotenv from 'dotenv'

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("database connected...");
    } catch (error) {
        console.log("error");
    }
}
export default connectDB;