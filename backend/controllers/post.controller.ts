import Post from "../models/post.model";
import User from "../models/user.model";
import { ApiError, ApiSuccessResponse, asyncHandler } from "../utils";
import { commentDto, createPostDto } from "../utils/validation-dtos/post.dto";
import { Types } from "mongoose";
import Notification from "../models/notification.model";
import { NotificationTypes } from "../utils/enums";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";

export const createPost = asyncHandler(async (req, res) => {

    if (req.file) req.body.image = req.file.path // adding the path to the body of the request

    const validatedBody = createPostDto.parse(req.body);

    let uploadedImage: string | null = null;

    if (validatedBody.image) {
        // upload image to cloudinary
        const result = await uploadToCloudinary(validatedBody.image);
        uploadedImage = result?.secure_url || null
    }

    const post = new Post({
        user: req.user.id,
        text: validatedBody.text,
        image: uploadedImage,
    })

    await post.save();

    return res.status(201).json(new ApiSuccessResponse('Post created successfully'));
})


export const deletePost = asyncHandler(async (req, res) => {

    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) throw new ApiError('Post not found', 404);

    if (post.user.toString() !== req.user.id) throw new ApiError('You are not authorized to delete this post', 401);

    if (post.image) {
        // delete image from cloudinary
        await deleteFromCloudinary(post.image);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json(new ApiSuccessResponse('Post deleted successfully'));
})


export const commentOnPost = asyncHandler(async (req, res) => {

    const { id: postId } = req.params;

    const validatedBody = commentDto.parse(req.body);

    const post = await Post.findById(postId);

    if (!post) throw new ApiError('Post not found', 404);


    post.comments.push({
        user: req.user.id,
        text: validatedBody.text,
    })

    await post.save();

    return res.status(200).json(new ApiSuccessResponse('Comment added successfully'));
})


export const likeUnlikePost = asyncHandler(async (req, res) => {

    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    const userId = req.user.id;

    if (!post) throw new ApiError('Post not found', 404);

    if (userId === post.user.toString()) throw new ApiError('You cannot like your own post', 400);

    const isLiked = (post.likes as Types.ObjectId[]).includes(userId);

    if (isLiked) {
        await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

        //pull the post from the user's likedPosts array
        await User.findByIdAndUpdate(userId, { $pull: { likedPosts: post._id } });

    } else {
        await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

        //push the post to the user's likedPosts array
        await User.findByIdAndUpdate(userId, { $push: { likedPosts: post._id } });

        // create notification
        const notification = new Notification({
            from: userId,
            to: post.user,
            type: NotificationTypes.LIKE,
            isRead: false
        })

        await notification.save();
    }

    return res.status(200).json(new ApiSuccessResponse(`Post ${isLiked ? 'unliked' : 'liked'} successfully`));
})



export const getAllPosts = asyncHandler(async (req, res) => {

    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'username fullname profileImg').populate('comments.user', 'username fullname profileImg')

    return res.status(200).json(new ApiSuccessResponse('Posts fetched successfully', posts));
})


export const getUserLikedPosts = asyncHandler(async (req, res) => {

    const { id: userId } = req.params;

    const user = await User.findById(userId).populate('likedPosts');

    if (!user) throw new ApiError('User not found', 404);

    return res.status(200).json(new ApiSuccessResponse('Posts fetched successfully', user.likedPosts));
})

export const getFollowingPosts = asyncHandler(async (req, res) => {

    const { id: userId } = req.user;


    const user = await User.findById(userId);

    if (!user) throw new ApiError('User not found', 404);

    const following = user.following as Types.ObjectId[];

    const posts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate('user', 'username fullname profileImg')

    return res.status(200).json(new ApiSuccessResponse('Posts fetched successfully', posts));
})


export const getUserPost = asyncHandler(async (req, res) => {

    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) throw new ApiError('User not found', 404);

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })

    return res.status(200).json(new ApiSuccessResponse('Posts fetched successfully', posts));
})