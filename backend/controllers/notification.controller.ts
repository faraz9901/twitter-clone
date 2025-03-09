import Notification from "../models/notification.model";
import { ApiError, ApiSuccessResponse, asyncHandler, stringToObjectId } from "../utils";

export const getNotifications = asyncHandler(async (req, res) => {

    let { id: userId } = req.user;

    userId = stringToObjectId(userId);

    // mark all notifications as read
    await Notification.updateMany({ to: userId }, { $set: { isRead: true } });

    const notifications = await Notification.find({ to: userId }).sort({ createdAt: -1 }).populate('from', 'profileImg username');

    return res.status(200).json(new ApiSuccessResponse('Notifications fetched successfully', notifications));
})


export const deleteAllNotifications = asyncHandler(async (req, res) => {

    let { id: userId } = req.user;

    userId = stringToObjectId(userId);

    await Notification.deleteMany({ to: userId });

    return res.status(200).json(new ApiSuccessResponse('Notifications deleted successfully'));
})


export const deleteNotification = asyncHandler(async (req, res) => {

    const { id: notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) throw new ApiError('Notification not found', 404);

    if (notification.to.toString() !== req.user.id) throw new ApiError('You are not authorized to delete this notification', 401);

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json(new ApiSuccessResponse('Notification deleted successfully'));
})


export const markAsNotificationRead = asyncHandler(async (req, res) => {

    const { id: notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) throw new ApiError('Notification not found', 404);

    if (notification.to.toString() !== req.user.id) throw new ApiError('You are not authorized to mark this notification as read', 401);

    await Notification.findByIdAndUpdate(notificationId, { $set: { isRead: true } });

    return res.status(200).json(new ApiSuccessResponse('Notification marked as read successfully'));
})