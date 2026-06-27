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
            resource_type : "auto",  //cloudinary automatically detect kr lega kis type ki file hai?(image,video,json,audio,pdf)
            secure: true
        });
        
        const imageUrl = response.secure_url || response.url;
        console.log("File uploaded successfully to Cloudinary");
        console.log("Image URL:", imageUrl);

        // Delete the temporary file from the server
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error("Error deleting temp file after success:", unlinkError);
        }
        
        // Return the full response object so we have access to all properties
        return {
            ...response,
            url: imageUrl,
            secure_url: imageUrl
        };
    } catch (error) {
        try {
            fs.unlinkSync(localFilePath);  //code to remove temporary file from server.
        } catch (unlinkError) {
            console.error("Error deleting temp file:", unlinkError);
        }
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
}

export default uploadOnCloudinary;