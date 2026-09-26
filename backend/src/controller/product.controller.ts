import asyncHandler from "../middleware/asyncHandler.js";
import ProductModel from "../models/product.model.js";
import AppError from "../utils/appError.js";
import { GenerateSlug } from "../utils/slug.js";
import UploadImage from "../utils/uploadImage.js";
import { productSchema } from "../validations/product.js";


export const GetAllproducts = asyncHandler(async (_req, res) => {

    const products = await ProductModel.find().sort({ createdAt: -1, _id: -1 }).lean();

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

    const body  ={
        ...req.body,
        price:JSON.parse(req.body.price)
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
        files.map(UploadImage)
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

export const UpdateProduct = asyncHandler(async () => {
   
})