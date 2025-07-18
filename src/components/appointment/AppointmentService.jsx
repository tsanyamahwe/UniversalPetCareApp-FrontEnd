import { api } from "../utils/api";

export async function bookAppointment(senderId, recipientId, appointmentRequest) {
    try {
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