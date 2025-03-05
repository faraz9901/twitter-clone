import { Response } from "express";
import mongoose from "mongoose";
import { NotificationTypes } from "../utils/enums";

interface UserDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    fullname: string;
    password: string;
    email: string;
    followers: mongoose.Types.ObjectId[] | UserDocument[];
    following: mongoose.Types.ObjectId[] | UserDocument[];
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    likedPosts: mongoose.Types.ObjectId[] | UserDocument[];
    comparePassword: (password: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<void>;
    generateJWTandSetCookie: (res: Response) => void
}

interface NotificationDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId | UserDocument;
    to: mongoose.Types.ObjectId | UserDocument;
    type: NotificationTypes
    isRead: boolean
}

interface PostDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | UserDocument;
    text: string;
    image: string;
    likes: mongoose.Types.ObjectId[] | UserDocument[];
    comments: Array<{
        text: string;
        user: mongoose.Types.ObjectId | UserDocument;
        createdAt?: Date
    }>
}


export type { UserDocument, NotificationDocument, PostDocument }