import { z } from "zod";

import { PASSWORD_REGEX , EMAIL_REGEX } from "../constant/regex.js";

export const loginSchema = z.object({

    email: z.string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, "Invalid Email address"),
        
    password: z.string().trim()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .regex(PASSWORD_REGEX, "Password must include uppercase, lowercase, number, and special character"),

})

export type LoginSchemaType = z.infer<typeof loginSchema>;