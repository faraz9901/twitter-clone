import { NextFunction, Response } from "express";
import { ApiError, ApiSuccessResponse } from "./ApiResponses";
import { RequestWithUser } from "../types";
import { ZodError } from "zod";

const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => any) => (req: RequestWithUser, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);


function globalErrorHandler(err: any, _req: RequestWithUser, res: Response, _next: NextFunction) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message || "Something went wrong",
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

    return res.status(500).json({
        message: "Something went wrong",
        success: false,
    });
}



export { asyncHandler, globalErrorHandler, ApiError, ApiSuccessResponse }