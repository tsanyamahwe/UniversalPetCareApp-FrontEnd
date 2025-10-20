import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cacheKeys, invalidateCache } from "../config/QueryClientConfig";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9192/api/v1';

// fetch all veterinarians
export const useVeterinarians = () => {
    return useQuery({
        queryKey: cacheKeys.veterinarians.all,
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/veterinarians`);
            return data;
        },
    });
};

// fetch single veterinarian
export const useVeterinarian = (vetId) => {
    return useQuery({
        queryKey: cacheKeys.veterinarians.detail(vetId),
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/veterinarians/${vetId}`);
            return data;
        },
        enabled: !!vetId, // only run if vetId exists
    });
};

export const useUpdateVeterinarian = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({vetId, veterinarianData}) => {
            const { data } = await axios.put(`${API_BASE_URL}/veterinarians/${vetId}`, veterinarianData);
            return data;
        },
        onSuccess: (data, variables) => {
            invalidateCache.veterinarians(queryClient, variables.vetId);
        },
    });
};