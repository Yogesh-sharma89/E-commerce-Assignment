import { api } from "../../../service/api";
import type { Product } from "../types/product";
import type { ProductFormValues } from "../../../schema/product.schema";

interface CreateProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product;
    };
}

export const createProductApi = async (values: ProductFormValues): Promise<Product> => {
    
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", JSON.stringify(values.price));
    formData.append("stock", String(values.stock));
    formData.append("isActive", String(values.isActive));

    if (values.brand) formData.append("brand", values.brand);
    if (values.category) formData.append("category", values.category);
    if (values.features) formData.append("features", values.features);
    if (values.returnPolicy) formData.append("returnPolicy", values.returnPolicy);
    if (values.shippingInfo) formData.append("shippingInfo", values.shippingInfo);

    values.images.forEach((image) => formData.append("images", image));

    const response = await api.post<CreateProductResponse>("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data.product;
};
