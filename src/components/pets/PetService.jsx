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