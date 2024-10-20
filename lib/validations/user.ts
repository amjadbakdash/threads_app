import * as z from "zod"


export const userValidation = z.object({
    profile_photo: z.string().url(),
    name: z.string().min(3).max(15),
    username: z.string().min(3).max(15),
    bio: z.string().min(3).max(1000)
})