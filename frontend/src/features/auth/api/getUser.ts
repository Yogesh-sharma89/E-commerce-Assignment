import { api } from "../../../service/api"

const getUserApi  = async()=>{

    try{
        const res = await api.get("/auth/me");
        return res.data;

    }catch(err){
     console.log("error in get user api : ",err)
     throw err;
    }
}

export default getUserApi;