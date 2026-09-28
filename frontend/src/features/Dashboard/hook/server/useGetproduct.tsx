import { useQuery } from "@tanstack/react-query"
import { getAllProductsApi } from "../../api/getAllProducts"
import { getProductApi } from "../../api/getOneProduct"

export const useGetAllproducts = ()=>{
    return useQuery({
        queryKey:['all-products'],
        queryFn:getAllProductsApi,

        retry:false,
        staleTime:10*60*1000,
        gcTime:15*60*1000,

        refetchOnWindowFocus:false,
    })
}

export const useGetProduct  = (productId:string)=>{

    return useQuery({
        queryKey:['product',productId],
        queryFn:()=>getProductApi(productId),
        enabled:!!productId,
        retry:false,
        staleTime:10*60*1000,
        gcTime:15*60*1000,

        refetchOnWindowFocus:false,
    })
}