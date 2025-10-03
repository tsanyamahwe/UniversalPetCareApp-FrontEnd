import { api } from "../utils/api";

export async function getVeterinarians() {
    try {
        const result = await api.get("/veterinarians/get-all-veterinarians");
        return result.data;
    } catch (error) {
        throw error;
    }    
};

export async function findAvailableVeterinarians(searchParams) {
    try {
        const queryParams = new URLSearchParams(searchParams);
        const result = await api.get(`/veterinarians/search-veterinarian?${queryParams}`);
        return result.data;
    } catch (error) {
        throw error;
    }
}; 

export async function getVetSpecializations() {
    try {
        const result = await api.get("/veterinarians/get-vet-specializations");
        return result.data;
    } catch (error) {
        throw error;
    }
};

export async function editSpecialization(vetId, newSpecialization) {
    try {
        const result = await api.put(`/veterinarians/${vetId}/specialization`, {newSpecialization});
        return result.data;
    } catch (error) {
        throw error;
    }
};


