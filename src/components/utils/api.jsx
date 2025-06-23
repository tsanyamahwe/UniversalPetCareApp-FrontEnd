import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:9192/api/v1',
});

export default api;