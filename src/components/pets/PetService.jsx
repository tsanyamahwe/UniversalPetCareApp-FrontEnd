import { api } from "../utils/api";

export async function getPetTypes() {
    try {
        const result = await api.get("/pets/get-pet-types");
        return result.data;
    } catch (error) {
        throw error;
    }
}

export async function getPetColors() {
    try {
        const result = await api.get("/pets/get-pet-colors");
        return result.data;
    } catch (error) {
        throw error;
    }
}

export async function getPetBreeds(petType) {
    try {
        const result = await api.get(`/pets/get-pet-breeds?petType=${petType}`);
        return result.data;
    } catch (error) {
        throw error;
    }
}

 export async function savePets(pets) {
     try{
         const result = await api.post("pets/save-pets", pets);
         return result.data;
     }catch(error){
          throw error;
     }
 }

 export async function updatePet(petId, updatedPet) {
    try {
        const result = await api.put(`/pets/pet/${petId}/update`, updatedPet);
        return result.data;
    } catch (error) {
        throw error;
    }
 }

 export const deletePet = async (petId) => {
    try {
        const response = await api.delete(`/pets/pet/${petId}/delete`);
        return response.data;
    } catch (error) {
        throw error;
    }
 }

export const addPet = async (appointmentId, petData) => {
    try {
        const response = await api.post(`/pets/save-pet-for-appointment/${appointmentId}`, petData);
        return response.data;
    } catch (error) {
        console.error('Error adding pet:', error);
        throw new Error(error.message || 'Failed to add pet. Please try again.');
    }
};