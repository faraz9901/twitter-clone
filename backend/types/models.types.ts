import { Response } from "express";
import mongoose from "mongoose";
import { NotificationTypes } from "../utils/enums";

interface User extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    fullname: string;
    password: string;
    email: string;
    followers: mongoose.Types.ObjectId[] | User[];
    following: mongoose.Types.ObjectId[] | User[];
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    likedPosts: mongoose.Types.ObjectId[] | User[];
    comparePassword: (password: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<void>;
    generateJWTandSetCookie: (res: Response) => void
}

interface Notification extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId | User;
    to: mongoose.Types.ObjectId | User;
    type: NotificationTypes
    isRead: boolean
}

interface Post extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | User;
    text: string;
    image: string;
    likes: mongoose.Types.ObjectId[] | User[];
    comments: Array<{
        text: string;
        user: mongoose.Types.ObjectId | User;
        createdAt?: Date
    }>
}


export type { User, Notification, Post }