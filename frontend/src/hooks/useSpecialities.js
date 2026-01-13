import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import specialityApi from '../api/specialityApi';
import { toast } from 'react-toastify';
import { handleError } from '../services/errorHandler';

export const useSpecialities = (params) => {
    return useQuery({
        queryKey: ['specialities', params],
        queryFn: () => specialityApi.getAll(params),
        keepPreviousData: true, // Keep data while fetching new page
    });
};

export const useCreateSpeciality = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: specialityApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['specialities']);
            toast.success('Speciality created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create speciality')
    });
};

export const useUpdateSpeciality = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => specialityApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['specialities']);
            toast.success('Speciality updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update speciality')
    });
};

export const useDeleteSpeciality = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: specialityApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['specialities']);
            toast.success('Speciality deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete speciality')
    });
};
