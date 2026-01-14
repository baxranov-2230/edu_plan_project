import api from './axios';

const eduPlanApi = {
    getAll: async (params) => {
        const response = await api.get('/edu-plans/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/edu-plans/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/edu-plans/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/edu-plans/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/edu-plans/${id}`);
        return response.data;
    },
};

export default eduPlanApi;
