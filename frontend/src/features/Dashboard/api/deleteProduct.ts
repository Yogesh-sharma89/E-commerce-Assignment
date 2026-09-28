import { api } from "../../../service/api";

const deleteProductApi = async(productId:string)=>{

    if(!productId || !productId.trim()) return;

    try{

        const res = await api.delete(`/products/${productId}`);
        return res.data;

    }catch(err){
     console.log("Error in delete product api :",err);
     throw err;
    }
}

export default deleteProductApi;