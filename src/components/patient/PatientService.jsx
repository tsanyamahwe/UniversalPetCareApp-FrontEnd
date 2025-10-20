import api from "../utils/api";

export async function getPatients() {
    try {
        const result = await api.get("/patients/get-all-patients");
        return result.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Assignment
 * 
 * Implement the Patients API from the backend to the frontend
 * 
 * 1. The Backend.
 * a) Implement the backend Controller, Service and Repository.
 * b) Create the endpoint to get all the patients and send to frontend.
 * c) Transfer all feedback messages and endpoint string to the appropriate classes.
 * 
 * 2. The Frontend.
 * a) Recieve the patients data from the backend and display them on the PatientCompnent in the Admin Dashboard
 * b) Complete the UserFilter component and use it to filter patients by email on the PatientCompnent.
 * 
 * //Remember to do all the neccessary imports
 */