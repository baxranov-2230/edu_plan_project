import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../api/userApi';
import { toast } from 'react-toastify';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: userApi.getAll,
        onError: (error) => {
            toast.error('Gavel user list failed');
        }
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to create user');
        }
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => userApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to update user');
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to delete user');
        }
    });
};
