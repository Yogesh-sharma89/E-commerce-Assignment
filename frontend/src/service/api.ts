import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  (response)=>response,

  async(error)=>{

    const originalRequest = error.config;

    try{

      if(error.response?.status===401 && !originalRequest._retry){
        originalRequest._retry = true;
  
         await api.post("/auth/refresh-token");
  
        return api(originalRequest)
      }else{
        return Promise.reject(error);
      }
    }catch(err){
      console.log("Failed to refresh token");
      return Promise.reject(err);
    }


  }
)