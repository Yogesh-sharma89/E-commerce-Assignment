import { api } from "../../../service/api"

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    profileUrl?: string;
    role: "user" | "seller";
}

interface GetCurrentUserResponse {
    success: boolean;
    message: string;
    data: {
        user: CurrentUser;
    };
}

const getUserApi = async (): Promise<CurrentUser> => {

    console.log("🔥🔥 AUTH ME REQUEST");

    try {
        const res = await api.get<GetCurrentUserResponse>("/auth/me");
        return res.data.data.user;

    } catch (err) {
        console.log("error in get user api : ", err)
        throw err;
    }
}

export default getUserApi;