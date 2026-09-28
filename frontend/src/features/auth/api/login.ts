import { api } from "../../../service/api";

interface loginData {
    email: string,
    password: string
}

const loginApi = async (data:loginData) => {

    if (!data || typeof data !== 'object') {
        console.log("Invalid login data")
        return;
    }

    try {
        const res = await api.post("/auth/login",  data );
        console.log(res.data?.data.user)

        return res.data?.data.user;

    } catch (err) {
     console.log("Error in login api :" ,err);
     throw err;
    }
}

export default loginApi;