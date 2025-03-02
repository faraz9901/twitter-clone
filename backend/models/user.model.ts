import mongoose from "mongoose";
import * as argon2d from "argon2";
import { UserDocument } from "../types";
import { Response } from "express";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    }
}, { timestamps: true });


userSchema.methods.hashPassword = async function () {
    this.password = await argon2d.hash(this.password);
};

userSchema.methods.comparePassword = async function (password: string) {
    return await argon2d.verify(this.password, password);
};

userSchema.methods.generateJWTandSetCookie = function (res: Response) {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET as string);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 15, //15 days in ms
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });
}

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;