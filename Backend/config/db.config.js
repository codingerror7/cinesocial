import mongoose from 'mongoose'
import dotenv from 'dotenv'

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("database connected...no error");
    } catch (error) {
        console.log("error:",error);
    }
}
export default connectDB;