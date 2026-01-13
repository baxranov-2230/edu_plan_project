import { create } from 'zustand';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const useDepartmentStore = create((set, get) => ({
    departments: [],
    loading: false,
    error: null,

    fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/departments/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch departments');
            const data = await response.json();
            set({ departments: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createDepartment: async (departmentData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/departments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(departmentData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create department');
            }
            const newDepartment = await response.json();
            set(state => ({
                departments: [...state.departments, newDepartment],
                loading: false
            }));
            return newDepartment;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateDepartment: async (id, departmentData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/departments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(departmentData)
            });
            if (!response.ok) throw new Error('Failed to update department');
            const updatedDepartment = await response.json();
            set(state => ({
                departments: state.departments.map(d => d.id === id ? updatedDepartment : d),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteDepartment: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/departments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete department');
            set(state => ({
                departments: state.departments.filter(d => d.id !== id),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    }
}));

export default useDepartmentStore;
