import { api } from "../../../service/api";
import type { Product } from "../types/product";

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product;
    };
}

export const getProductApi = async (productId: string): Promise<Product | undefined> => {

    if (!productId || !productId.trim()) return undefined;

    try {

        const res = await api.get<GetProductResponse>(`/products/${productId}`);

        return res.data?.data?.product;
    } catch (err) {
        console.log("Error in get one product api :", err);
        throw err;
    }
}