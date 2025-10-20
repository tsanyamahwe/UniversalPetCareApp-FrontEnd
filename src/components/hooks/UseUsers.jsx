import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cacheKeys, invalidateCache } from "../config/QueryClientConfig";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9192/api/v1';

// fetch user profile
export const useUserProfile = (userId) => {
    return useQuery({
        queryKey: cacheKeys.users.profile(userId),
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/users/${userId}`);
            return data;
        },
        enabled: !!userId,
    });
};

// update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({userId, userData}) => {
            const { data } = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
            return data;
        },
        onSuccess: (data, variables) => {
            invalidateCache.users(queryClient, variables.userId);
        },
    });
};

// logout (clear all caches)
export const useLogout = () => {
    const queryClient = useQueryClient();
    return () => {
        invalidateCache.all(queryClient);
    };
};