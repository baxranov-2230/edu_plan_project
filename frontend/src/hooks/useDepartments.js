import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import departmentApi from '../api/departmentApi';
import { toast } from 'react-toastify';
import { handleError } from '../services/errorHandler';

export const useDepartments = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: departmentApi.getAll,
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create department')
    });
};

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => departmentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update department')
    });
};

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete department')
    });
};
