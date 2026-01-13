import api from './axios';

const roleApi = {
    getAll: async () => {
        const response = await api.get('/roles/');
        return response.data;
    },
    getPermissions: async () => {
        const response = await api.get('/roles/permissions');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/roles/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
};

export default roleApi;
