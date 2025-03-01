import { NextFunction, Request, Response } from "express";
import { ApiError, ApiSuccessResponse } from "./ApiResponses";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);


function globalErrorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message || "Something went wrong",
            success: false,
            stack: err.stack
        });
    }

    return res.status(500).json({
        message: "Something went wrong",
        success: false,
    });
}



export { asyncHandler, globalErrorHandler, ApiError, ApiSuccessResponse }