import { create } from 'zustand';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const useRoleStore = create((set, get) => ({
    roles: [],
    permissions: [],
    loading: false,
    error: null,

    fetchRoles: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/roles/');
            set({ roles: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
            // toast.error('Failed to fetch roles');
        }
    },

    fetchPermissions: async () => {
        try {
            const response = await axios.get('/roles/permissions');
            set({ permissions: response.data });
        } catch (error) {
            console.error('Failed to fetch permissions', error);
        }
    },

    createRole: async (roleData) => {
        try {
            const response = await axios.post('/roles/', roleData);
            set((state) => ({ roles: [...state.roles, response.data] }));
            toast.success('Role created successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to create role');
            return false;
        }
    },

    updateRole: async (id, roleData) => {
        try {
            const response = await axios.put(`/roles/${id}`, roleData);
            set((state) => ({
                roles: state.roles.map((r) => (r.id === id ? response.data : r)),
            }));
            toast.success('Role updated successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update role');
            return false;
        }
    },

    deleteRole: async (id) => {
        if (!window.confirm('Are you sure you want to delete this role?')) return;
        try {
            await axios.delete(`/roles/${id}`);
            set((state) => ({
                roles: state.roles.filter((r) => r.id !== id),
            }));
            toast.success('Role deleted successfully');
        } catch (error) {
            toast.error('Failed to delete role');
        }
    }
}));

export default useRoleStore;
