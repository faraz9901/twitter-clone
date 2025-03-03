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


export type { UserDocument, NotificationDocument }