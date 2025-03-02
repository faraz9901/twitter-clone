import { Response } from "express";
import mongoose from "mongoose";

interface UserDocument extends mongoose.Document {
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
    hashPassword: () => Promise<void>;
    generateJWTandSetCookie: (res: Response) => void
}


export type { UserDocument }