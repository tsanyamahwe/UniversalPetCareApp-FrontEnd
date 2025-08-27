import { api } from "../utils/api";

export async function getUserById(userId) {
    try {
        const result = await api.get(`/users/user/${userId}`);
        return result.data;
    } catch (error) {
        throw error;
    }
}

export async function userRegistration(user) {
    try {
        const response = await api.post("/users/register", user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function changeUserPassword(userId, currentPassword, newPassword, confirmNewPassword) {
    try {
        const requestData = {currentPassword, newPassword, confirmNewPassword};
        const response = await api.put(`/users/user/${userId}/change-password`, requestData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(userData, userId) {
    try {
        const response = await api.put(`/users/update/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export async function deleteUserAccount(userId) {
    try {
        const response = await api.delete(`/users/delete/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function countVeterinarians(){
    try {
        const response = await api.get("/users/count/veterinarians");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function countPatients(){
    try {
        const response = await api.get("/users/count/patients");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function countUsers(){
    try {
        const response = await api.get("/users/count/users");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAggregateUsersByMonthAndType = async () => {
    try {
        const response = await api.get("/users/aggregated-users");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAggregatedUsersAccountsByActiveStatus = async () => {
    try {
        const response = await api.get("/users/accounts/aggregated-by-status");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const aggregateVeterinariansBySpecialization = async () => {
    try {
        const response = await api.get("/veterinarians/aggregate-vets-by-specialization");
        return response.data;
    } catch (error) {
        throw error;
    }
}