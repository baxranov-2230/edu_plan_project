import api from './axios';

const facultyApi = {
    getAll: async () => {
        const response = await api.get('/faculties/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/faculties/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/faculties/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/faculties/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/faculties/${id}`);
        return response.data;
    },
};

export default facultyApi;
