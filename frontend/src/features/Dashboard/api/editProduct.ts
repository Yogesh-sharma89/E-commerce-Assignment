import { api } from "../../../service/api";
import type { Product } from "../types/product";
import type { ProductUpdateInput } from "../../../schema/product.schema";

interface EditProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product;
    };
}

export const editProductApi = async (
    productId: string,
    values: ProductUpdateInput,
): Promise<Product> => {

    if (!productId.trim()) {
        throw new Error("Product ID is required to update a product");
    }

    const images = values.images ?? [];
    const replaceImageIds = values.replaceImageIds ?? [];
    const removeImageIds = values.removeImageIds ?? [];

    if (images.length !== replaceImageIds.length) {
        throw new Error("Each replacement image must have a matching existing image ID");
    }
    if (new Set(replaceImageIds).size !== replaceImageIds.length) {
        throw new Error("An existing image can only be replaced once");
    }
    if (replaceImageIds.some((imageId) => removeImageIds.includes(imageId))) {
        throw new Error("An image cannot be replaced and removed in the same update");
    }

    const formData = new FormData();

    if (values.title !== undefined) formData.append("title", values.title);
    if (values.description !== undefined) formData.append("description", values.description);
    if (values.price !== undefined) formData.append("price", JSON.stringify(values.price));
    if (values.brand !== undefined) formData.append("brand", values.brand);
    if (values.stock !== undefined) formData.append("stock", String(values.stock));
    if (values.isActive !== undefined) formData.append("isActive", String(values.isActive));
    if (values.category !== undefined) formData.append("category", values.category);
    if (values.features !== undefined) formData.append("features", values.features);
    if (values.returnPolicy !== undefined) formData.append("returnPolicy", values.returnPolicy);
    if (values.shippingInfo !== undefined) formData.append("shippingInfo", values.shippingInfo);

    images.forEach((image) => formData.append("images", image));

    if (replaceImageIds.length > 0) {
        formData.append("replaceImageIds", JSON.stringify(replaceImageIds));
    }
    if (removeImageIds.length > 0) {
        formData.append("removeImageIds", JSON.stringify(removeImageIds));
    }

    const response = await api.put<EditProductResponse>(
        `/products/${encodeURIComponent(productId)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data.data.product;
};