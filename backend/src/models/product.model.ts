import mongoose from "mongoose";
import type { IPRODUCT } from "../types/schema/product.js";
import productMediaSchema from "./productMedia.model.js";

const productSchema = new mongoose.Schema<IPRODUCT>({

    title: {
        type: String,
        required: [true, "Product title is required"],
        trim: true,
        minlength: [3, "Product title must be at least 3 characters"],
        maxlength: [120, "Product title must not exceed 120 characters"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: [10, "Product description must be at least 10 characters"],
        maxlength: [2000, "Product description must not exceed 2000 characters"]
    },
    price: {
        amount: {
            type: Number,
            required: [true, "Price amount is required"],
            min: [0, "Price amount cannot be negative"],
            validate: {
                validator: Number.isFinite,
                message: "Price amount must be a finite number"
            }
        },
        currency: {
            type: String,
            required: [true, "Price currency is required"],
            trim: true,
            enum:["INR","USD","PKR","JPY"],
            default:"INR"
        }
    },
    slug: {
        type: String,
        required: [true, "Product slug is required"],
        trim: true,
        minlength: [1, "Product slug cannot be empty"]
    },

    images:[productMediaSchema],

    brand: { type: String, trim: true },

    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: [0, "Product stock cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "Product stock must be a whole number"
        }
    },

    isActive: {
        type: Boolean,
        required: [true, "Product active status is required"]
    },

    category: { type: String, trim: true },
    features: { type: String, trim: true },
    returnPolicy: { type: String, trim: true },
    shippingInfo: { type: String, trim: true }
}, {
    timestamps: true
});

const ProductModel = mongoose.model<IPRODUCT>("product", productSchema);

export default ProductModel;

