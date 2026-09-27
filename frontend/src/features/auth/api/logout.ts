import { api } from "../../../service/api";

const logoutApi = async()=>{

    try{
        const res  = await api.post("/auth/logout");
        return res.data;

    }catch(err){
        console.log("Error in logout api :",err);
        throw err;
    }
}

export default logoutApi;