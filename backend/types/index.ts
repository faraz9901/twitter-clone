import type { Request } from "express";
import type { User, Notification, Post } from "./models.types";

type RequestWithUser = Request & {
    user?: any;
}

type UserDocument = User;
type NotificationDocument = Notification;
type PostDocument = Post;


export { RequestWithUser, UserDocument, NotificationDocument, PostDocument }
