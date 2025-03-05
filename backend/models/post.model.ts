import mongoose from "mongoose";
import { PostDocument } from "../types";

const postSchema = new mongoose.Schema<PostDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
    },

    image: {
        type: String,
    },

    likes: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        default: []
    },

    comments: {
        type: [
            {
                text: {
                    type: String,
                    required: true
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: new Date(),
                }
            }
        ],
        default: []
    }
}, { timestamps: true })


const Post = mongoose.model<PostDocument>('Post', postSchema);

export default Post