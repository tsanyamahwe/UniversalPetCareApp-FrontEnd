import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cacheKeys, invalidateCache } from "../config/QueryClientConfig";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9192/api/v1';

// fetch reviews for veterinarian
export const useVeterinarianReviews = (vetId) => {
    return useQuery({
        queryKey: cacheKeys.reviews.byVet(vetId),
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/reviews/veterinarian/${vetId}`);
            return data;
        },
        enabled: !!vetId,
    });
};

// submit reviews
export const useSubmitReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reviewData) => {
            const { data } = await axios.post(`${API_BASE_URL}/reviews`, reviewData);
            return data;
        },
        onSuccess: (data, variables) => {
            invalidateCache.reviews(queryClient, variables.vetId, variables.userId);
        },
    });
};