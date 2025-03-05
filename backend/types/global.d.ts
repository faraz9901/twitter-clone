import type { Request } from "express";
import type { User, Notification, Post } from "./models.types";

declare global {
    interface RequestWithUser extends Request {
        user?: any;
    }

    type UserDocument = User;
    type NotificationDocument = Notification;
    type PostDocument = Post;
}


export { };
