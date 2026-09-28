import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductApi } from "../../api/createProduct";
import { editProductApi } from "../../api/editProduct";
import type { ProductUpdateInput } from "../../../../schema/product.schema";
import  deleteProductApi from "../../api/deleteProduct";

interface UpdateProductVariables {
  productId: string;
  values: ProductUpdateInput;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-product"],
    mutationFn: createProductApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-products"],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-product"],
    mutationFn: ({ productId, values }: UpdateProductVariables) =>
      editProductApi(productId, values),
    onSuccess: (_data,variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product',variables.productId],
      });
    },
  });
};

export const useDeleteProduct = ()=>{

      const queryClient = useQueryClient();

      return useMutation({
        mutationKey:['delete-product'],
        mutationFn:({productId}:{productId:string})=>deleteProductApi(productId),

        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['all-products']
            })
        }
      })
}
