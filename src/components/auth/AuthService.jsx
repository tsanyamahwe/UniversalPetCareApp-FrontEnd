import api from "../utils/api";

export const verifyEmail = async(token) =>{
    try {
        const response = await api.get(`/auth/verify-your-email?token=${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function resendVerificationToken(oldToken) {
    try {
        const response = await api.put(`/auth/resend-verification-token?token=${oldToken}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async(email, password) => {
    try {
        const response = await api.post("/auth/login", {email, password});
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Backend logout failed:", error);
    }finally{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRoles");
        window.location.href = "/";
    }
};

export async function requestPasswordReset(email) {
    try {
        const response = await api.post("/auth/request-password-reset", {email});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function validateToken(token) {
    try {
        const result = await api.get(`/auth/can-reset-password-by-token?token=${token}`);
        if(result.data && result.data.canReset !== undefined){
            return{
                status: "VALID",
                canReset: result.data.canReset,
                daysRemaining: result.data.daysRemaining || 0
            };
        }
        return result.data;
    } catch (error) {
        console.error("Token validation error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            fullError: error
        });
        throw error;
    }
};

export async function resetPassword(token, newPassword) {
    try {
        const response = await api.post("/auth/reset-password", {token, newPassword});
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 425){
            throw new Error(error.response.data.message || error.response.data);
        }
        if(error.response && error.response.status === 400){
            throw new Error(error.response.data.message || "Invalid or expired token");
        }
        throw error;
    }
};

export const canResetPassword = async (email) => {
    try {
        const response = await api.get(`/auth/can-reset-password?email=${encodeURIComponent(email)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const canResetPasswordByToken = async (token) => {
    try {
        const response = await api.get(`/auth/can-reset-password-by-token?token=${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPasswordChangeInfo = async (userId) => {
    try {
        const response = await api.get(`/users/password-change-info/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeUserPassword = async (userId, newPassword) => {
    try {
        const response = await api.post(`/users/change-password/${userId}`, {newPassword: newPassword});
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 425){
            throw new Error(error.response.data);
        }
        throw error;
    }
};

