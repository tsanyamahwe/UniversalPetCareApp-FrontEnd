import api from "../utils/api";

export async function addReview(veterinarianId, reviewerId, appointmentId, reviewInfo) {
    try {
        const token = localStorage.getItem("token");
        const payload = {
            ...reviewInfo,
            appointmentId: appointmentId
        };
        const response = await api.post(`reviews/submit-review?reviewerId=${reviewerId}&veterinarianId=${veterinarianId}`, 
            payload, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function getPatientAppointments(patientId, status) {
    const token = localStorage.getItem("token");
    try {
        const response = await api.get(`appointments/user/${patientId}?status=${status}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export async function getReviewByAppointmentId(appointmentId) {
    const token = localStorage.getItem("token");
    try {
        const response = await api.get(`reviews/review-by-appointment/${appointmentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export async function updateReview(reviewId, reviewUpdateRequest) {
    const token = localStorage.getItem("token");
    try {
        const response = await api.put(`/reviews/review/${reviewId}/update`, 
            reviewUpdateRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function deleteReview(reviewId) {
    const token = localStorage.getItem("token");
    try {
        const response = await api.delete(`/reviews/review/${reviewId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function findEligibleAppointment(userId, vetId) {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/appointments/eligible-for-review?patientId=${userId}&veterinarianId=${vetId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};