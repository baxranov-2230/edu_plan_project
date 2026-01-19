import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/rest/api/v1';

const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    permissions: [],

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await axios.post(`${API_URL}/auth/access-token`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            const decoded = jwtDecode(access_token);

            set({
                token: access_token,
                isAuthenticated: true,
                user: {
                    email: decoded.sub,
                    id: decoded.id,
                    role: decoded.role,
                    name: decoded.name
                },
                permissions: decoded.permissions || [],
                loading: false
            });

            return true;
        } catch (error) {
            console.error('Login error:', error);
            set({
                error: error.response?.data?.detail || 'Login failed',
                loading: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, permissions: [] });
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    set({ user: null, token: null, isAuthenticated: false, permissions: [] });
                } else {
                    set({
                        user: {
                            email: decoded.sub,
                            id: decoded.id,
                            role: decoded.role,
                            name: decoded.name
                        },
                        permissions: decoded.permissions || [],
                        isAuthenticated: true
                    });
                }
            } catch (error) {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false, permissions: [] });
            }
        }
    },

    hasPermission: (permission) => {
        const { permissions, user } = get();
        // If user is superuser (implied by admin role or specific flag if we had one)
        // For now, let's assume 'admin' role has all perms based on backend mapping, 
        // but in backend superuser bypasses everything. 
        // Since we don't send is_superuser in token yet, we rely on permissions list.
        if (!permissions) return false;
        return permissions.includes(permission);
    }
}));

export default useAuthStore;
