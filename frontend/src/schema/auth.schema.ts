import { z } from "zod";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constant/regex";

export const registerSchema = z.object({

    fullname: z.string().trim().min(3, "Fullname must be at least 3 characters")
        .max(30, "Fullname must not exceed 30 characters"),

    email: z.string().trim()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, "Invalid email address"),

    password: z.string().trim()
        .min(1, 'Password is required')
        .min(8, "Password must be 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(
            PASSWORD_REGEX,
            "Password must be 8-64 characters and include uppercase and lowercase letters, a number"
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),

   role: z.enum(['user', 'seller']).default("user")


}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>


export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required').regex(EMAIL_REGEX, "Invalid email address"),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(
            PASSWORD_REGEX,
            "Password must be 8-64 characters and include uppercase and lowercase letters, a number"
        ),
    rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>
export type LoginFormInput = z.input<typeof loginSchema>