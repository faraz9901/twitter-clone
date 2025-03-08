import { NextFunction, Response } from "express";
import { ApiError, ApiSuccessResponse } from "./ApiResponses";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { RequestWithUser } from "../types";


const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => any) => (req: RequestWithUser, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

function globalErrorHandler(err: any, _req: RequestWithUser, res: Response, _next: NextFunction) {

    console.log(err)

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


const stringToObjectId = (id: string) => {
    return new mongoose.Types.ObjectId(id)
}


export { asyncHandler, globalErrorHandler, stringToObjectId, ApiError, ApiSuccessResponse }