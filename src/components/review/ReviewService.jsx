import api from "../utils/api";

export async function addReview(veterinarianId, reviewerId, reviewInfo) {
    try {
        const response = await api.post(`reviews/submit-review?reviewerId=${reviewerId}&veterinarianId=${veterinarianId}`, reviewInfo);
        return response.data;
    } catch (error) {
        throw error;
    }
}