import User from "../models/user.model";
import { ApiError, ApiSuccessResponse, asyncHandler } from "../utils";
import { signinDto, signupDto } from "../validation-dtos/auth.dto";

export const signin = asyncHandler(async (req, res) => {

    // validation using zod if error it will throw an error which is handled by global error handler
    signinDto.parse(req.body);

    const user = await User.findOne({ username: req.body.username });

    if (!user) throw new ApiError('User not found', 404);

    const isValidPassword = await user.comparePassword(req.body.password)

    console.log(isValidPassword);

    if (!isValidPassword) throw new ApiError('Invalid credentials', 401);

    user.generateJWTandSetCookie(res);

    return res.status(200).json(new ApiSuccessResponse('User signed in successfully', {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        followers: user.followers,
        following: user.following
    }));
});


export const signup = asyncHandler(async (req, res) => {
    signupDto.parse(req.body);

    const isUserExists = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });

    if (isUserExists) throw new ApiError('User with email or username already exists', 400);

    const user = new User(req.body);

    await user.hashPassword();

    const newUser = await user.save();

    if (!newUser) throw new ApiError('User could not be created', 500);

    newUser.generateJWTandSetCookie(res);

    return res.status(201).json(new ApiSuccessResponse('User created successfully', {
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        followers: newUser.followers,
        following: newUser.following
    }));
});

export const signout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json(new ApiSuccessResponse('User signed out successfully'));
});


export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json(new ApiSuccessResponse('User fetched successfully', user));
})
