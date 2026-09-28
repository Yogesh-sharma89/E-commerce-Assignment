import { api } from "../../../service/api";
import type { CurrentUser } from "./getUser";

interface UpdateProfileAvatarResponse {
    success: boolean;
    message: string;
    data: {
        user: CurrentUser;
    };
}

const updateProfileAvatar = async (file: File): Promise<CurrentUser> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.put<UpdateProfileAvatarResponse>(
        "/auth/profile/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data.data.user;
};

export default updateProfileAvatar;
