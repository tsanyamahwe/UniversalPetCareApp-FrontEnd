import { api } from "../utils/api";

export async function bookAppointment(senderId, recipientId, appointmentRequest) {
    try {
        console.log("The appointment request", appointmentRequest);
        const result = await api.post(`/appointments/book-appointment?senderId=${senderId}&recipientId=${recipientId}`, appointmentRequest);
        console.log(result);
        return result.data;
    } catch (error) {
        throw error;
    }
}

export const updateAppointment = async (appointmentId, appointmentData) => {
    try {
        const response = await api.put(`appointments/appointment/${appointmentId}/update`, appointmentData);
        console.log("Two :", response.data.message);
        return response;
    } catch (error) {
        throw error;
    }
} 

export async function cancelAppointment(appointmentId) {
    try {
        const response = await api.put(`/appointments/appointment/${appointmentId}/cancel`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function approveAppointment(appointmentId) {
    try {
        const response = await api.put(`/appointments/appointment/${appointmentId}/approve`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function declineAppointment(appointmentId) {
    try {
        const response = await api.put(`/appointments/appointment/${appointmentId}/decline`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAppointmentById = async(appointmentId) => {
    try {
        const result = await api.get(`/appointments/appointment/${appointmentId}/fetchappointment`);
        return result.data;
    } catch (error) {
        throw error;
    }
}