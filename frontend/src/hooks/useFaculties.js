import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import facultyApi from '../api/facultyApi';
import { toast } from 'react-toastify';
import { handleError } from '../services/errorHandler';

export const useFaculties = () => {
    return useQuery({
        queryKey: ['faculties'],
        queryFn: facultyApi.getAll,
    });
};

export const useCreateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: facultyApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['faculties']);
            toast.success('Faculty created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create faculty')
    });
};

export const useUpdateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => facultyApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['faculties']);
            toast.success('Faculty updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update faculty')
    });
};

export const useDeleteFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: facultyApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['faculties']);
            toast.success('Faculty deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete faculty')
    });
};
