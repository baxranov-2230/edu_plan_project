import api from './axios';

const subjectApi = {
    getAll: async (params) => {
        const response = await api.get('/subjects/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/subjects/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/subjects/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/subjects/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/subjects/${id}`);
        return response.data;
    },
};

export default subjectApi;
