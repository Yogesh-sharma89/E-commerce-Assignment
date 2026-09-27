import { api } from "../../../service/api";

interface RegisterApiData{
    fullname:string,
    email:string,
    password:string
}

const registerApi = async(data:RegisterApiData)=>{
    
    if(!data || typeof data !=='object'){
        console.log("Invalid register data");
        return;
    }

    try{

        const res = await api.post("/auth/register",{data});

        console.log(res.data?.data.user)

        return res.data?.data.user;

    }catch(err){
       console.log("Error in register api :",err);
       throw err;
    }
}
export default registerApi;