import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import { ApiError, globalErrorHandler } from "./utils";
import dotenv from "dotenv";
import { connectToDB } from "./utils/db";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());

app.use('/api/auth', authRoutes)


//global error handler
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next);
});

app.listen(PORT, () => {
    console.log('server started at ' + PORT);
    connectToDB()
});