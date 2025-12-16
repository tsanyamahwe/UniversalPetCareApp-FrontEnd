import api from "../utils/api";
import { UserType } from "../utils/Utilities";

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

export const getGoogleIdToken = async (idTokenOrData) => {
    try {
        //If it's just a token string, this is a login attempt
        if(typeof idTokenOrData === 'string'){
            const result = await api.post("/auth/social/login", {
                provider: "GOOGLE", 
                token: idTokenOrData
            });
            return result;
        }
        //If it's an object with userType, this is a registration
        if(idTokenOrData.userType){
            const result = await api.post("/auth/social/register", {
                provider: "GOOGLE",
                token: idTokenOrData.token,
                email: idTokenOrData.email,
                firstName: idTokenOrData.firstName,
                lastName: idTokenOrData.lastName,
                userType: idTokenOrData.userType,
                gender: idTokenOrData.gender,
                phoneNumber: idTokenOrData.phoneNumber,
                specialization: idTokenOrData.specialization || '',
                vetLicence: idTokenOrData.vetLicence || ''
            });
            return result;
        }
        // Otherwise, treat as login with token object
        const result = await api.post("/auth/social/login", {provider: "GOOGLE", token: idTokenOrData.token});
        return result;
    } catch (error) {
        console.error('Error calling Google API:', error);
       throw error;
    }
};

export const getFacebookAccessToken = async (accessTokenOrData) => {
    try {
        //If it is just a token string, this is a login attempt 
        if(typeof accessTokenOrData === 'string'){
            const response = await api.post("/auth/social/login", {
                provider: "FACEBOOK",
                token: accessTokenOrData
            });
            return response;
        } 
        //If its an object with userType, this is a registration
        if(accessTokenOrData.userType){
            const response = await api.post("/auth/social/register", {
                provider: "FACEBOOK",
                token: accessTokenOrData.token,
                email: accessTokenOrData.email,
                firstName: accessTokenOrData.firstName,
                lastName: accessTokenOrData.lastName,
                userType: accessTokenOrData.userType,
                gender: accessTokenOrData.gender,
                phoneNumber: accessTokenOrData.phoneNumber,
                specialization: accessTokenOrData.specialization || '',
                vetLicense: accessTokenOrData.vetLicense || ''
            });
            return response;
        }
        //Otherwise treat as a login with token object
        const response = await api.post("/auth/social/login", {provider: "FACEBOOK", token: accessTokenOrData.token});
        return response;
    } catch (error) {
        console.error('Error calling Facebook auth API:', error);
        throw error;
    }
};

export const completeSocialRegistration = async (registrationData) => {
    try{
        const response = await api.post("/auth/social/complete-registration", registrationData);
        return response;
    }catch(error) {
        console.error('Error completeing social registraton:', error);
        if(error.response){
            throw new Error(error.response.data.error || error.response.data.message || 'Registration completion failed');
        }else if(error.request){
            throw new Error('No response from server. Please check your connection.');
        }else{
            throw new Error('Failed to complete registration');
        }
    }
};
