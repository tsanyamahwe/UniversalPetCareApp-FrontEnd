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