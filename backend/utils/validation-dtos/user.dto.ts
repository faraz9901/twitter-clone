import { z } from "zod";

const updateUserDto = z.object({
    fullname: z.string().optional(),
    bio: z.string().optional(),
    link: z.string().optional(),
    profileImg: z.any().optional(),
    coverImg: z.any().optional(),
    currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
})



export { updateUserDto }