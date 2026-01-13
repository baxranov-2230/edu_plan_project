import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleApi from '../api/roleApi';
import { toast } from 'react-toastify';
import { handleError } from '../services/errorHandler';

export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: roleApi.getAll,
    });
};

export const usePermissions = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: roleApi.getPermissions,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: roleApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['roles']);
            toast.success('Role created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create role')
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => roleApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['roles']);
            toast.success('Role updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update role')
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: roleApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['roles']);
            toast.success('Role deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete role')
    });
};
