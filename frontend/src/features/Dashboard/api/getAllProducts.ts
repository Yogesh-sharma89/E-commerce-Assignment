import { api } from "../../../service/api";
import type { Product } from "../types/product";

interface GetAllProductsResponse {
    success: boolean;
    message: string;
    data: {
        products: Product[];
    };
}

export const getAllProductsApi = async (): Promise<Product[]> => {
    try{

        const res = await api.get<GetAllProductsResponse>("/products");

        return res.data?.data?.products;

    }catch(err){
        console.log("Error in get all products api :",err);
        throw err;
    }
}