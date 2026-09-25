import { z } from "zod";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constant/regex.js";


export const registerSchema = z.object({
    fullname: z.string()
        .trim()
        .min(3, "Fullname should have minimum 3 characters")
        .max(30, "Fullname must not exceed 30 characters"),
    email: z.string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, "Invalid Email address"),
    password: z.string().trim()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .regex(PASSWORD_REGEX, "Password must include uppercase, lowercase, number, and special character"),
    profileUrl: z.string().default(""),
    profilePublicId: z.string().default("")
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

