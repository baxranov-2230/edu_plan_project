import api from './axios';

const workloadApi = {
    getAll: async (params) => {
        const response = await api.get('/workloads/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/workloads/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/workloads/', data);
        return response.data;
    },
    createBatch: async (data) => {
        const response = await api.post('/workloads/batch', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/workloads/${id}`, data);
        return response.data;
    },
    updateGroup: async (data) => {
        const response = await api.put('/workloads/group_update', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/workloads/${id}`);
        return response.data;
    },
    deleteGroup: async (subjectId) => {
        const response = await api.delete('/workloads/group', { params: { subject_id: subjectId } });
        return response.data;
    },
};

export default workloadApi;
