import mongoose from "mongoose";
import { NotificationTypes } from "../utils/enums";
import { NotificationDocument } from "../types";


const notificationSchema = new mongoose.Schema<NotificationDocument>({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [NotificationTypes.LIKE, NotificationTypes.FOLLOW],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);

export default Notification