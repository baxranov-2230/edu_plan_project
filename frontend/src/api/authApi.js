import api from './axios';

const authApi = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
};

export default authApi;
