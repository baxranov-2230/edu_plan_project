import axios from 'axios';
import useAuthStore from '../store/authStore';

// Access environment variable, fallback to localhost for dev
const baseURL = import.meta.env.VITE_API_URL || '/rest/api/v1';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors (e.g., 401 unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token might be expired
            const { logout } = useAuthStore.getState();
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
