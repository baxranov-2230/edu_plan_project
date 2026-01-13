import api from './axios';

const subgroupApi = {
    getAll: async (params) => {
        const response = await api.get('/subgroups/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/subgroups/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/subgroups/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/subgroups/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/subgroups/${id}`);
        return response.data;
    },
};

export default subgroupApi;
