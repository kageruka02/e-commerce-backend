const cloudinary = require('cloudinary');
const asyncHandler = require('express-async-handler');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


const cloudinaryUploadImg = asyncHandler (async(fileToUploads) => {
    try {

        const result = await cloudinary.uploader.upload(fileToUploads, {resource_type: "auto"})
        return { url: result.secure_url}
        
    }
    catch (error) {
        console.error("Cloudinary upload failed", error);
        throw new Error(error.message || "failed to upload");

    }
   
})



module.exports = cloudinaryUploadImg;