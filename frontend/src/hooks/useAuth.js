import { useMutation } from '@tanstack/react-query';
import authApi from '../api/authApi';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
    const { setTokens, setUser, setPermissions } = useAuthStore();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setTokens(data.access_token, data.refresh_token);
            // We often need to fetch user details separately or decode from token, 
            // but if the login response includes user info that's great. 
            // Assuming login returns tokens only based on previous files, 
            // but let's check authService. Actually authService.authenticate returned token, 
            // but we enhanced it to include permissions in payload.
            // Frontend authStore decodes the token to get these details.
            toast.success('Login successfully');
        },
        onError: (error) => {
            // toast.error(error.response?.data?.detail || 'Login failed');
            // Let the component handle UI error messages if needed or global toast here
        }
    });
};
