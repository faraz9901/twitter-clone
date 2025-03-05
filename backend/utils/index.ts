import { NextFunction, Response } from "express";
import { ApiError, ApiSuccessResponse } from "./ApiResponses";
import { RequestWithUser } from "../types";
import { ZodError } from "zod";
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadToCloudinary = async (file: any) => {
    return await cloudinary.uploader.upload(file)
}

const deleteFromCloudinary = async (url: string) => {
    const urlArray = url.split('/')

    const publicId = urlArray[urlArray.length - 1].split('.')[0]

    return await cloudinary.uploader.destroy(publicId)
}

const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => any) => (req: RequestWithUser, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);


function globalErrorHandler(err: any, _req: RequestWithUser, res: Response, _next: NextFunction) {

    // Error thrown by us
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }

    // handling all the validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.issues[0].message,
        })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: err.errors[0].message,
        })
    }

    if (err instanceof mongoose.Error.CastError) {
        // Mongoose cast error (e.g., invalid ObjectId)
        return res.status(400).send({ success: false, message: 'Invalid ID' });
    }


    // for any other errors
    return res.status(500).json({
        message: "Something went wrong",
        success: false,
    });
}




export { asyncHandler, globalErrorHandler, ApiError, ApiSuccessResponse, uploadToCloudinary, deleteFromCloudinary }