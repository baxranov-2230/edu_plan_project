import api from './axios';

const curriculumApi = {
    getAll: async (params) => {
        const response = await api.get('/curriculums/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/curriculums/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/curriculums/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/curriculums/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/curriculums/${id}`);
        return response.data;
    },
};

export default curriculumApi;
