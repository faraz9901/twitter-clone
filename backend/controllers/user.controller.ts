import { Types } from "mongoose";
import User from "../models/user.model";
import { ApiError, ApiSuccessResponse, asyncHandler } from "../utils";
import Notification from "../models/notification.model";
import { NotificationTypes } from "../utils/enums";
import { updateUserDto } from "../utils/validation-dtos/user.dto";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";

export const getUserProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password');

    if (!user) throw new ApiError('User not found', 404);

    return res.status(200).json(new ApiSuccessResponse('User fetched successfully', user));

})


export const followUser = asyncHandler(async (req, res) => {

    const { id: userId } = req.user;
    const { username } = req.params;

    const [userToFollow, user] = await Promise.all([
        User.findOne({ username }),
        User.findById(userId)
    ])

    if (!user || !userToFollow) throw new ApiError('User not found', 404);

    if (user._id.toString() === userToFollow._id.toString()) throw new ApiError('You cannot follow yourself', 400);

    const isFollowing = (user.following as Types.ObjectId[]).includes(userToFollow._id);

    if (isFollowing) {
        // if following already, then unfollow
        await User.findByIdAndUpdate(user._id, { $pull: { following: userToFollow._id } });
        await User.findByIdAndUpdate(userToFollow._id, { $pull: { followers: user._id } });
    } else {
        // follow the user
        await User.findByIdAndUpdate(user._id, { $push: { following: userToFollow._id } });
        await User.findByIdAndUpdate(userToFollow._id, { $push: { followers: user._id } });

        // create notification
        const notification = new Notification({
            from: user._id,
            to: userToFollow._id,
            type: NotificationTypes.FOLLOW,
            isRead: false
        })

        await notification.save();
    }

    return res.status(200).json(new ApiSuccessResponse(`You ${isFollowing ? 'unfollowed' : 'followed'} ${username}`))
})


export const getSuggestedUsers = asyncHandler(async (req, res) => {

    const { id: userId } = req.user;

    const user = await User.findById(userId);

    if (!user) throw new ApiError('User not found', 404);

    const following = user.following as Types.ObjectId[];

    // get users that are not the user himself or following the user
    const users = await User.find({ _id: { $nin: [...following, userId] } }).select('-password').limit(5);

    return res.status(200).json(new ApiSuccessResponse('Suggested users', users));
})


export const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.user;

    // if profile image is uploaded
    if (req.files && (req.files as any).profileImg) {
        req.body.profileImg = (req.files as any).profileImg[0].path;
    }

    // if cover image is uploaded
    if (req.files && (req.files as any).coverImg) {
        req.body.coverImg = (req.files as any).coverImg[0].path;
    }

    const validatedBody = updateUserDto.parse(req.body);

    const user = await User.findById(id);

    if (!user) throw new ApiError('User not found', 404);

    if (validatedBody.currentPassword && validatedBody.newPassword) {
        // check if password is correct
        const isCorrect = await user.comparePassword(validatedBody.currentPassword);

        if (!isCorrect) throw new ApiError('Invalid credentials', 401);

        await user.hashPassword(validatedBody.newPassword);
    }

    user.fullname = validatedBody.fullname || user.fullname;
    user.bio = validatedBody.bio || user.bio;
    user.link = validatedBody.link || user.link;

    // check if profile image is uploaded
    if (validatedBody.profileImg) {

        //check if the user has an old profile image
        if (user.profileImg) {
            // delete the old profile image
            await deleteFromCloudinary(user.profileImg);
        }

        const profileImg = await uploadToCloudinary(validatedBody.profileImg)

        user.profileImg = profileImg?.secure_url || user.profileImg;
    }

    if (validatedBody.coverImg) {

        //check if the user has an old cover image
        if (user.coverImg) {
            // delete the old cover image
            await deleteFromCloudinary(user.coverImg);
        }

        const coverImg = await uploadToCloudinary(validatedBody.coverImg)

        user.coverImg = coverImg?.secure_url || user.coverImg;
    }

    const updatedUser = await user.save()

    if (!updatedUser) throw new ApiError('User could not be updated', 500);

    return res.status(200).json(new ApiSuccessResponse('User updated successfully'));
})