import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import registerApi from "../../api/register"
import loginApi from "../../api/login"
import logoutApi from "../../api/logout"
import getUserApi from "../../api/getUser"

export const useRegisterMutation = () => {

    const queryclient = useQueryClient();

    return useMutation({
        mutationKey: ['register'],
        mutationFn: registerApi,

        onSuccess: () => {
            queryclient.invalidateQueries({
                queryKey: ['user']
            })
        }
    })
}



export const useLoginMutation = () => {

    const queryclient = useQueryClient();

    return useMutation({
        mutationKey: ['login'],
        mutationFn: loginApi,
        onSuccess: () => {
            queryclient.invalidateQueries({
                queryKey: ['user']
            })

        }
    })
}


export const useLogoutMutation = () => {

    const queryclient = useQueryClient();

    return useMutation({
        mutationKey: ['logout'],
        mutationFn: logoutApi,
        onSuccess: () => {
            queryclient.setQueryData(["user"],null);
        }
    })
}


export const useGetUser = () => {

    return useQuery({
        queryKey: ['user'],
        queryFn: getUserApi,
        retry:false,

        staleTime: 5 * 60 * 1000, // 5 minutes of "fresh" data
        gcTime: 15 * 60 * 1000,   // Keep in cache for 15 minutes if unmounted

        refetchOnWindowFocus: false, // Don't spam the API on tab switch
        refetchOnReconnect: true,

    })
}