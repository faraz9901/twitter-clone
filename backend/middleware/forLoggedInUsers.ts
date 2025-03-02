import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils";

const forLoggedInUsers = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) throw new ApiError('Unauthorized', 401);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decodedToken) throw new ApiError('Unauthorized', 401);

    req.user = decodedToken

    next();
})

export default forLoggedInUsers