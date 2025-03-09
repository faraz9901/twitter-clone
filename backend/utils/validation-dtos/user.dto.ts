import { z } from "zod";

const updateUserDto = z.object({
    fullname: z.string().optional(),
    bio: z.string().optional(),
    link: z.string().optional(),
    profileImg: z.string().optional(),
    coverImg: z.string().optional(),
    currentPassword: z.string().trim().optional().refine(value => !value || (value?.length && value.length >= 6), {
        message: "Current Password must be atleast 6 characters long"
    }),
    newPassword: z.string().trim().optional().refine(value => !value || (value?.length && value.length >= 6), {
        message: "New Password must be atleast 6 characters long"
    })
})



export { updateUserDto }