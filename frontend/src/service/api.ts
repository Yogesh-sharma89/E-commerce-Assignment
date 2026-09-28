import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

     if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try{

       await refreshClient.post("/auth/refresh-token");

       return api(originalRequest);

    }catch(err){
       console.log("Failed to refresh token ")
         return Promise.reject(err);
    }


  }
)