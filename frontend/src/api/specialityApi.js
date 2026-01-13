import api from './axios';

const specialityApi = {
    getAll: async (params) => {
        const response = await api.get('/specialities/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/specialities/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/specialities/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/specialities/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/specialities/${id}`);
        return response.data;
    },
};

export default specialityApi;
