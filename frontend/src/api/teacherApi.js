import api from './axios';

const teacherApi = {
    getAll: async (params) => {
        const response = await api.get('/teachers/', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/teachers/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/teachers/', data);
        return response.data;
    },
    update: async (id, data) => { // Endpoint might need to be added to backend or handle via specific User update
        // Current implementation in backend allows READ but CREATE/UPDATE logic for Teacher might be tied to User logic or needs specific endpoint if separate
        // Assuming /teachers/ endpoint handles it if I created it. Yes I created standard CRUD.
        const response = await api.put(`/teachers/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/teachers/${id}`);
        return response.data;
    },
};

export default teacherApi;
