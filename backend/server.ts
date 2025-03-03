import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary'

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { globalErrorHandler } from "./utils";
import { connectToDB } from "./utils/db";
import { RequestWithUser } from "./types";
import forLoggedInUsers from "./middleware/forLoggedInUsers";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', forLoggedInUsers, userRoutes)


//global error handler
app.use((err: any, req: RequestWithUser, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next);
});


app.listen(PORT, () => {
    console.log('server started at ' + PORT);
    connectToDB()
});