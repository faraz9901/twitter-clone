import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs';
import { ApiError } from '../ApiResponses';

const uploadToCloudinary = async (filePath: string) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        const uploadedImage = await cloudinary.uploader.upload(filePath)
        return uploadedImage
    } catch (error) {
        throw new ApiError('Error uploading image to cloudinary', 500)
    } finally {
        // delete the file from the server
        fs.unlinkSync(filePath);
    }
}

const deleteFromCloudinary = async (url: string) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const urlArray = url.split('/')

    const publicId = urlArray[urlArray.length - 1].split('.')[0]

    return await cloudinary.uploader.destroy(publicId)
}


export { uploadToCloudinary, deleteFromCloudinary }