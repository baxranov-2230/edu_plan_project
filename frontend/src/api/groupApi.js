import api from './axios';

const groupApi = {
    getAll: async (params) => {
        const response = await api.get('/groups/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/groups/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/groups/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/groups/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/groups/${id}`);
        return response.data;
    },
};

export default groupApi;
