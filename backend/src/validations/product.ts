import { z } from "zod";

const productMediaSchema = z.strictObject({

    url: z.string().trim().url("Enter a valid media URL"),
    type: z.enum(["image", "video"]).default("image"),
    publicId: z.string().trim().min(1).max(255).optional(),
    thumbnailUrl: z.string().trim().url("Enter a valid thumbnail URL").optional()

});

export const productSchema = z.strictObject({
    title: z.string()
        .trim()
        .min(3, "Product title must be at least 3 characters")
        .max(120, "Product title must not exceed 120 characters"),
    description: z.string()
        .trim()
        .min(10, "Product description must be at least 10 characters")
        .max(2000, "Product description must not exceed 2000 characters"),
    price: z.strictObject({
        amount: z.coerce.number()
            .finite("Price must be a finite number")
            .nonnegative("Price cannot be negative"),
        currency: z.enum(["INR", "USD", "PKR", "JPY"]).default("INR")
    }),

    images: z.array(productMediaSchema).default([]),
    brand: z.string().trim().min(1).max(120).optional(),
    stock: z.coerce.number()
        .int("Stock must be a whole number")
        .nonnegative("Stock cannot be negative"),
    isActive: z.string().transform((value)=>value==="true"),
    category: z.string().trim().min(1).max(120).optional(),
    features: z.string().trim().min(1).max(2000).optional(),
    returnPolicy: z.string().trim().min(1).max(2000).optional(),
    shippingInfo: z.string().trim().min(1).max(2000).optional()
});

export type ProductCreateInput = z.input<typeof productSchema>;

export type ProductData = z.output<typeof productSchema>;