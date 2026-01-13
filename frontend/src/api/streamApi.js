import api from './axios';

const streamApi = {
    getAll: async (params) => {
        const response = await api.get('/streams/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/streams/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/streams/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/streams/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/streams/${id}`);
        return response.data;
    },
};

export default streamApi;
