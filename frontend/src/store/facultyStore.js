import { create } from 'zustand';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const useFacultyStore = create((set, get) => ({
    faculties: [],
    loading: false,
    error: null,

    fetchFaculties: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/faculties/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch faculties');
            const data = await response.json();
            set({ faculties: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createFaculty: async (facultyData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/faculties/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(facultyData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create faculty');
            }
            const newFaculty = await response.json();
            set(state => ({
                faculties: [...state.faculties, newFaculty],
                loading: false
            }));
            return newFaculty;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateFaculty: async (id, facultyData) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/faculties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(facultyData)
            });
            if (!response.ok) throw new Error('Failed to update faculty');
            const updatedFaculty = await response.json();
            set(state => ({
                faculties: state.faculties.map(f => f.id === id ? updatedFaculty : f),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteFaculty: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const response = await fetch(`${API_URL}/faculties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete faculty');
            set(state => ({
                faculties: state.faculties.filter(f => f.id !== id),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    }
}));

export default useFacultyStore;
