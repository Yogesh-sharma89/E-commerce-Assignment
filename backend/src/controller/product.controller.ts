import asyncHandler from "../middleware/asyncHandler.js";
import ProductModel from "../models/product.model.js";

import AppError from "../utils/appError.js";
import DeleteImage from "../utils/deleteImage.js";

import { GenerateSlug } from "../utils/slug.js";
import UploadImage from "../utils/uploadImage.js";
import { productSchema, updateProductSchema } from "../validations/product.js";



export const GetAllproducts = asyncHandler(async (_req, res) => {

    const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1, _id: -1 }).lean();

    return res.status(200).json({
        success: true,
        message: "All products fetched successfully",
        data: {
            products
        }
    })


})

export const GetProductById = asyncHandler(async (req, res) => {

    const { id: productId } = req.params as { id: string };

    if (!productId || typeof productId !== "string" || !productId.trim()) {
        throw new AppError(400, "Invalid product request", "FAIL");
    }

    const validproductId = productId.trim();

    const product = await ProductModel.findById(validproductId);

    if (!product) {
        throw new AppError(404, `Product with this Id:${validproductId} doesn't exists`, "FAIL");
    }

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: {
            product
        }
    })

})


export const CreateProduct = asyncHandler(async (req, res) => {

    const body = {
        ...req.body,
        price: JSON.parse(req.body.price)
    }


    const validProductData = productSchema.safeParse(body);

    if (!validProductData.success) {

        const message = validProductData.error.issues.map((issue) => issue.message).join(", ");

        throw new AppError(400, message || "validation failed", "FAIL");
    }

    const productData = validProductData.data;

    const {
        title,
        description,
        price,
        brand,
        stock,
        isActive,
        category,
        features,
        returnPolicy,
        shippingInfo
    } = productData;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        throw new AppError(400, "At least 1 image is required to create product", "FAIL");
    }

    //upload files 
    const uploadRes = await Promise.all(
        files.map((file) => UploadImage(file))
    )

    //Generate slug 
    const slug = GenerateSlug(title!);

    const sku = `PROD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

    const product = await ProductModel.create({
        title,
        description,
        price,
        stock,
        slug,
        sku,
        isActive,
        ...(brand === undefined ? {} : { brand }),
        ...(category === undefined ? {} : { category }),
        ...(features === undefined ? {} : { features }),
        ...(returnPolicy === undefined ? {} : { returnPolicy }),
        ...(shippingInfo === undefined ? {} : { shippingInfo }),
        images: uploadRes
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: { product }
    });

})

export const DeleteProduct = asyncHandler(async (req, res) => {

    const { id: productId } = req.params as { id: string }

    const validproductId = productId.trim();

    if (!validproductId || typeof validproductId !== "string") {
        throw new AppError(400, "Invalid product deletion request", "FAIL");
    }

    const product = await ProductModel.findById(validproductId);

    if (!product) {
        throw new AppError(404, `Product with Id:${validproductId} doesn't exists`, "FAIL");
    }

    //Finally delete the product 

    await ProductModel.deleteOne({ _id: product._id });

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })

})

export const UpdateProduct = asyncHandler(async (req, res) => {

    const { id: productId } = req.params as { id: string };

    const validProductId = productId.trim();

    if (!validProductId) {
        throw new AppError(400, "Invalid product Id", "FAIL")
    }

    const body = {
        ...req.body,
        ...(req.body.price && {
            price: JSON.parse(req.body.price)
        }),
        ...(req.body.replaceImageIds && {
            replaceImageIds: JSON.parse(req.body.replaceImageIds)
        }),
        ...(req.body.removeImageIds && {
            removeImageIds: JSON.parse(req.body.removeImageIds)
        })
    }

    const validProductData = updateProductSchema.safeParse(body);

    if (!validProductData.success) {
        const message = validProductData.error.issues.map((issue) => issue.message).join(", ")
        throw new AppError(400, message || "Validation failed", "FAIL");
    }

    const {
        images,
        replaceImageIds: replaceImageIds_s,
        removeImageIds: removeImageIds_s,
        ...productData
    } = validProductData.data;

    //find the product 
    const product = await ProductModel.findById(validProductId);

    if (!product) {
        throw new AppError(404, "Product doesn't exists", "FAIL")
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const replaceImageIds = replaceImageIds_s ?? [];
    const removeImageIds = removeImageIds_s ?? [];

    if (files.length !== replaceImageIds.length) {
        throw new AppError(400, "Each replacement image must have a matching image Id", "FAIL");
    }

    const uniqueTargetIds = new Set([...replaceImageIds, ...removeImageIds]);
    if (uniqueTargetIds.size !== replaceImageIds.length + removeImageIds.length) {
        throw new AppError(400, "Image Ids must be unique and cannot be both replaced and removed", "FAIL");
    }

    const requestedImageIds = [...replaceImageIds, ...removeImageIds];
    for (const publicId of requestedImageIds) {
        const isImageExists = product.images.some((img) => img.publicId?.toString() === publicId);
        if (!isImageExists) {
            throw new AppError(400, `Image with Id:${publicId} not found for this product`, "FAIL");
        }
    }

    const uploadRes = await Promise.all(files.map((file) => UploadImage(file)));
    const previousImageIds = [...replaceImageIds, ...removeImageIds];

    replaceImageIds.forEach((publicId, index) => {
        const existingImage = product.images.find((img) => img.publicId === publicId);
        const uploadedImage = uploadRes[index];

        if (!existingImage || !uploadedImage?.url || !uploadedImage.type) {
            throw new AppError(400, "Invalid product image replacement", "FAIL");
        }

        existingImage.url = uploadedImage.url;
        existingImage.type = uploadedImage.type;
        if (uploadedImage.publicId !== undefined) existingImage.publicId = uploadedImage.publicId;
        if (uploadedImage.thumbnailUrl !== undefined) existingImage.thumbnailUrl = uploadedImage.thumbnailUrl;
    });

    if (removeImageIds.length > 0) {
        const removedIds = new Set(removeImageIds);
        product.images = product.images.filter((image) => !removedIds.has(image.publicId ?? ""));
    }

    if (files.length > 0 || removeImageIds.length > 0) {
        await product.save();

        const deletionResults = await Promise.allSettled(previousImageIds.map(DeleteImage));
        const failedDeletes = deletionResults.filter((result) => result.status === "rejected");
        if (failedDeletes.length > 0) console.log("Failed to delete replaced/removed images:", failedDeletes);
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId,
        { $set: productData },
        {
            runValidators: true,
            returnDocument: "after"
        }
    )


    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: {
            product: updatedProduct
        }
    })
})