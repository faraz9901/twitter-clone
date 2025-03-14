import express, { NextFunction, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/posts.routes";
import notificationRoutes from "./routes/notification.route";

// middlewares
import forLoggedInUsers from "./middleware/forLoggedInUsers";

// utils
import { globalErrorHandler } from "./utils";
import { connectToDB } from "./utils/db";
import { RequestWithUser } from "./types";

//import "./types/global"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', forLoggedInUsers, userRoutes)
app.use('/api/posts', forLoggedInUsers, postRoutes)
app.use('/api/notifications', forLoggedInUsers, notificationRoutes)

//global error handler
app.use((err: any, req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(err)
    globalErrorHandler(err, req, res, next);
});


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    })
}


app.listen(PORT, () => {
    console.log('server started at ' + PORT);
    connectToDB()
});