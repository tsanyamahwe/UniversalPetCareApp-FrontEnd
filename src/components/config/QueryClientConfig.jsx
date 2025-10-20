import { QueryClient } from "@tanstack/react-query";

/**
 * Centralized React Query configuration matching backend cache strategy
 * cache keys align with Spring Cache: user, appointments, veterinarians, patients, reviews
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // cache configuration
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
            cacheTime: 10 * 60 * 1000, //10 minutes - cache retenion
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
            retry: 1,
            
            networkMode: 'online',// network configuration - only fetch when online
        },
        mutations: {
            retry: 1,
            networkMode: 'online',
        },
    },
});

export const cacheKeys = {
    // Users cache
    users: {
        all: ['users'],
        detail: (userId) => ['users', userId],
        profile: (userId) => ['users', 'profile', userId],
        dashboard: (userId) => ['users', 'dashboard', userId],
    }, 
    // Veterinarians Cache
    veterinarians: {
        all: ['veterinarians'],
        detail: (vetId) => ['veterinarians', vetId],
        available: ['veterinarians', 'available'],
        bySpecialty: (specialty) => ['veterinarians', 'specialty', specialty],
    },
    //Appointments cache
    appointments: {
        all: ['appointments'],
        detail: (appointmentId) => ['appointments', appointmentId],
        byUser: (userId) => ['appointments', 'user', userId],
        byVet: (vetId) => ['appointments', 'vet', vetId],
        upcoming: (userId) => ['appointments', 'upcoming', userId],
        past: (userId) => ['appointments', 'past', userId],
    },
    // Patients cache
    patients: {
        all: ['patients'],
        detail: (patientId) => ['patients', patientId],
        byUser: (userId) => ['patients', 'user', userId],
    },
    // Reviews cache
    reviews: {
        all: ['reviews'],
        byVet: (vetId) => ['reviews', 'vet', vetId],
        byUser: (userId) => ['reviews', 'user', userId],
    },
};

export const invalidateCache = {
    // Invalidate user-related caches
    users: (queryClient, userId = null) => {
        if(userId){
            queryClient.invalidateQueries({queryKey: cacheKeys.users.detail(userId)});
            queryClient.invalidateQueries({queryKey: cacheKeys.users.profile(userId)});
            queryClient.invalidateQueries({queryKey: cacheKeys.users.dashboard(userId)});
        }else{
            queryClient.invalidateQueries({queryKey: cacheKeys.users.all});
        }
    },

    // Invalidate veterinarian-related caches
    veterinarians: (queryClient, vetId = null) => {
        if(vetId){
            queryClient.invalidateQueries({queryKey: cacheKeys.veterinarians.detail(vetId)});
        }else{
            queryClient.invalidateQueries({queryKey: cacheKeys.veterinarians.all});
        }
    },

    // Invalidate appointment-relatd caches
    appointments: (queryClient, userId = null, vetId = null) => {
        queryClient.invalidateQueries({queryKey: cacheKeys.appointments.all});
        if(userId){
            queryClient.invalidateQueries({queryKey: cacheKeys.appointments.byUser(userId)});
            queryClient.invalidateQueries({queryKey: cacheKeys.appointments.upcoming(userId)});
            queryClient.invalidateQueries({queryKey: cacheKeys.appointments.past(userId)});
        }
        if(vetId){
            queryClient.invalidateQueries({queryKey: cacheKeys.appointments.byVet(vetId)});
        }
    },
    // Invalidate patient-related caches
    patients: (queryClient, userId = null) => {
        if(userId){
            queryClient.invalidateQueries({queryKey: cacheKeys.patients.byUser(userId)});
        }else{
            queryClient.invalidateQueries({queryKey: cacheKeys.patients.all});
        }
    },

    //Invalidate review-related caches
    reviews: (queryClient, vetId = null, userId = null) => {
        if(vetId){
            queryClient.invalidateQueries({queryClient: cacheKeys.reviews.byVet(vetId)});
        }
        if(userId){
            queryClient.invalidateQueries({queryKey: cacheKeys.reviews.byUser(userId)});
        }
        if(!vetId && !userId){
            queryClient.invalidateQueries({queryKey: cacheKeys.reviews.all});
        }
    },

    // Clear all caches
    all: (queryClient) => {
        queryClient.clear();
    },
};

export const prefetchData = {
    veterinarian: async (queryClient, vetId, fetchFn) => {
        await queryClient.prefetchQuery({
            queryKey: cacheKeys.veterinarians.detail(vetId),
            queryFn: fetchFn,
            staleTime: 5 * 60 * 1000,
        });
    },

    userProfile: async (queryClient, userId, fetchFn) => {
        await queryClient.prefetchQuery({
            queryKey: cacheKeys.users.profile(userId),
            queryFn: fetchFn,
            staleTime: 5 * 60 * 1000,
        });
    },
};