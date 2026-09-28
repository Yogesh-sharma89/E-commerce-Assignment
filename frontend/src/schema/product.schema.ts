import { z } from 'zod';

export const productSchema = z.strictObject({
    title: z
        .string()
        .trim()
        .min(3, 'Product title must be at least 3 characters')
        .max(120, 'Product title must not exceed 120 characters'),
    description: z
        .string()
        .trim()
        .min(10, 'Product description must be at least 10 characters')
        .max(2000, 'Product description must not exceed 2000 characters'),
    price: z.strictObject({
        amount: z.number().finite().nonnegative('Price cannot be negative'),
        currency: z.enum(['INR', 'USD', 'PKR', 'JPY']).default('INR'),
    }),
    images: z.array(z.file()).max(5, 'Maximum 5 images allowed'),
    brand: z.string().trim().min(1).max(120).optional(),
    stock: z.number().int('Stock must be a whole number').nonnegative('Stock cannot be negative'),
    isActive: z.boolean(),
    category: z.string().trim().min(1).max(120).optional(),
    features: z.string().trim().min(1).max(2000).optional(),
    returnPolicy: z.string().trim().min(1).max(2000).optional(),
    shippingInfo: z.string().trim().min(1).max(2000).optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
    price: productSchema.shape.price.partial().optional(),
    replaceImageIds: z.array(z.string()).optional(),
    removeImageIds: z.array(z.string()).optional(),
});

export type ProductFormValues = z.output<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductUpdateInput = z.output<typeof productUpdateSchema>;

export interface ProductImageChanges {
    replaceImageIds: string[];
    removeImageIds: string[];
}
