import { create } from 'zustand';
import { jwtDecode } from "jwt-decode"; // Correct import for v4

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        set({ token, user: decoded, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
    },

    // Optional: Function to initialize user from token on app load
    initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry if needed
                set({ token, user: decoded, isAuthenticated: true });
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
                set({ token: null, user: null, isAuthenticated: false });
            }
        }
    }
}));

export default useAuthStore;
