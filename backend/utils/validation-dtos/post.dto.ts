import { z } from "zod";

const createPostDto = z.object({
    text: z.string().optional(),
    image: z.string().optional(),
}).refine(data => data.text || data.image, {
    message: "Either text or image is required.",
    path: ["text", "image"],
});


const commentDto = z.object({
    text: z.string({ required_error: "Comment is required" }),
})
export { createPostDto, commentDto }
