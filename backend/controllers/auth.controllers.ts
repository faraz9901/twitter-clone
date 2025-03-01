import { asyncHandler } from "../utils";

export const signin = asyncHandler(async (req, res) => {
    res.send('login')
});


export const signup = asyncHandler(async (req, res) => {
    res.send('signup')
})

export const logout = asyncHandler(async (req, res) => {
    res.send('logout')
});