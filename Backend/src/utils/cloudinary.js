import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"  //cloudinary automatically detect kr lega kis type ki file hai?(image,video,json,audio,pdf)
        });
        console.log("file uploaded successfully",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);  //code to remove temporary file from server.
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
}

export default uploadOnCloudinary;