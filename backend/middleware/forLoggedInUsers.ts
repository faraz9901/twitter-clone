import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils";

const forLoggedInUsers = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) throw new ApiError('Unauthorized', 401);

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        if (!decodedToken) throw new Error('Invalid token');

        req.user = decodedToken
    } catch (error) {
        throw new ApiError('Session expired', 401);
    }

    next();
})

export default forLoggedInUsers