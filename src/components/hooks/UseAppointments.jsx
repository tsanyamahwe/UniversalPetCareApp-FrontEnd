import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cacheKeys, invalidateCache } from "../config/QueryClientConfig";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9192/api/v1';

//fetch user appointments
export const useUserAppointments = (userId) => {
    return useQuery({
        queryKey: cacheKeys.appointments.byUser(userId),
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/appointments/user/${userId}`);
            return data;
        },
        enabled: !!userId,
    });
};

// fetch upcoming appointments
export const useUpComingAppointments = (userId) => {
    return useQuery({
        queryKey: cacheKeys.appointments.upcoming(userId),
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE_URL}/appointments/user/${userId}/upcoming`);
            return data;
        },
        enabled: !!userId,
    });
};

// book appointment
export const useBookAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (appointmentData) => {
            const { data } = await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
            return data;
        },
        onSuccess: (data, variables) => {
            invalidateCache.appointments(queryClient, variables.userId, variables.vetId);
        },
    });
};

// cancel appointment
export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (appointmentId) => {
            const { data } = await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`);
            return data;
        },
        onSuccess: () => {
            invalidateCache.appointments(queryClient);
        },
    });
};